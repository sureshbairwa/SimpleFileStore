import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateTokenAndSetCookie = (userId, res) => {
    // console.log("userId", userId);
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });

	res.cookie("jwt-drive", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, 
		httpOnly: true, 
		sameSite: "strict", 
		secure: process.env.NODE_ENV !== "development",
	});

	return token;
};
