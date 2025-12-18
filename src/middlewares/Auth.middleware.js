import { asynchandler } from "../utility/asynchandler.js";
import { ApiError } from "../utility/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asynchandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized Access , Token missing");
    }
    const decodeToken = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    const user = await User.findById(decodeToken?.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Unauthorized Access , User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized Access , Token invalid");
  }
});
