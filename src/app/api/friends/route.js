import User from "@/app/models/User"; 
import { NextResponse } from "next/server";
import connectToDatabase from '../../../db/db';
import jwt from 'jsonwebtoken';


connectToDatabase();
export async function GET(request){
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
          }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Token missing' }, { status: 401 });
    }


    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 402 });
    }

    const user = await User.findById(decoded.id);

    if(!user){
        return NextResponse.json({ error: 'User Not found, Failed to fetch User Request Notificaitons' }, { status: 403 });
    }

    const {friendRequestNotification} = user;


    if(!friendRequestNotification){
        return NextResponse.json({ message: 'Currently Users have no Friend Request Notifications' }, { status: 201 });
    }

    return NextResponse.json(friendRequestNotification, {status: 200});

    } catch (error) {
        return NextResponse.json({error: "Error in Fetching UserRequests"}, {status: 200});
    }


}