import { Router } from "express";
import { getUser, loggedOut, loginUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ])
    ,getUser);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,loggedOut);


export default router;