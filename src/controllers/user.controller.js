import { asynchandler } from "../utility/asynchandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utility/ApiError.js";
import { uploadToCloudinary } from "../utility/cloudinary.js";
import { ApiResponse } from "../utility/ApiResponse.js";


const generateAccessandRefreshToken = async (userId) => {
  try {
   const user =  await User.findById(userId);
   const accessToken = user.generateAccessToken();
   const refreshToken =user.generateRefreshToken();
   user.refreshToken = refreshToken;
   await user.save({validateBeforeSave:false});
   return { accessToken, refreshToken };
    
  } catch (error) {
    throw new ApiError(500, "Token generation failed");
  }
}


const getUser = asynchandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;
  if (!username || !email || !fullName || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatarUploadResponse = await uploadToCloudinary(avatarLocalPath);
  const coverImageUploadResponse = await uploadToCloudinary(
    coverImageLocalPath
  );

  if (!avatarUploadResponse) {
    throw new ApiError(500, "Image upload failed");
  }

  const user = await User.create({
    username,
    email,
    fullName,
    password,

    avatar: avatarUploadResponse.url, // STRING
    coverImage: coverImageUploadResponse?.url,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: createdUser,
  });
});

const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isMatch = await user.isPasswordMatch(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }
  
  const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };
  return res.status(200).cookie("refreshToken", refreshToken, option).cookie("accessToken", accessToken, option).json(
    new ApiResponse(true, "Login successful", {
      user: loggedInUser,
      accessToken,
    })
  );
});

const loggedOut = asynchandler(async (req, res) => {
  User.findByIdAndUpdate(req.user._id, { refreshToken: undefined });
  const option = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res.status(200).clearCookie("refreshToken", "", option).clearCookie("accessToken", "", option).json(
    new ApiResponse(true, "Logout successful")
  );
})

export { getUser, loginUser, loggedOut };