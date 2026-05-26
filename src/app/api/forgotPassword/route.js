import User from "@/app/models/User";
import { LogIn } from "lucide-react";
import { NextResponse } from "next/server";

import dotenv from 'dotenv';
dotenv.config();


export async function POST(req, res){
    try {
        const {email} = req.body;
        const oldUser  = await User.findOne({email});
        if(!oldUser){
            return NextResponse.json({message: "No User with this email exists"})
        }

        const secret = JWT_SECRET + oldUser.password;
        const token = jwt.sign({email: oldUser.email, id: oldUser._id}, secret, {expiresIn: "5m"})
        const link = `http://localhost:3000/reset-password/${oldUser._id}/${token}`
        console.log("linK", link);
        

    } catch (error) {
        return NextResponse.json({message: "Error in Forgetting Password"})
    }
}