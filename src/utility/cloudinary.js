import { v2 as cloudinary }  from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, 
            {resource_type : "auto"}
        ) 
        fs.unlinkSync(localFilePath); // Delete the local file after upload
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.error("Error uploading file to Cloudinary", error);
        throw error;
    }
}

export { uploadToCloudinary };