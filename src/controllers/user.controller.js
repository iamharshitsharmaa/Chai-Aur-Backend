import {asynchandler} from "../utility/asynchandler.js";
import {User} from "../models/user.model.js"
import { ApiError } from "../utility/ApiError.js";
import { uploadToCloudinary } from "../utility/cloudinary.js";

export const getUser = asynchandler(async (req, res) => {
   
    const {username,email,fullName,password} = req.body;
    if(!username || !email || !fullName || !password){
        return res.status(400).json({
            success : false,
            message : "All fields are required"
        });
    }

    const existedUser = User.findOne({
        $or:[{username},{email}]
    })
    if (existedUser){
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
     
    if(!avatarLocalPath){
        throw new ApiError (400, "Avatar and Cover Image are required");
    }

    const avatarUploadResponse = await uploadToCloudinary(avatarLocalPath);
    const coverImageUploadResponse = await uploadToCloudinary(coverImageLocalPath);

    if(!avatarUploadResponse){
        throw new ApiError (500, "Image upload failed");
    }

   const user =  await User.create({
        username,
        email,
        fullName,
        password,
        avatar : {
            public_id : avatarUploadResponse.public_id,
            url : avatarUploadResponse.url},
        coverImage : {
            public_id : coverImageUploadResponse.public_id,
            url : coverImageUploadResponse.url}
    })

   const createdUser= await User.findbyId(User._id).select("-password -refreshToken");

   if(!createdUser){
    throw new ApiError(500, "User creation failed");
   }



});