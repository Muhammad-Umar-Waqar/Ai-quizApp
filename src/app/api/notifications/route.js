// app/api/notifications/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../models/User';
import dotenv from 'dotenv';
import connectToDatabase from '../../../db/db';


dotenv.config();
connectToDatabase();
export async function GET(request) {
  // await connectToDatabase();
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID not provided' }, { status: 400 });
    }

    const user = await User.findById(userId).populate('notifications.quizId')

    // .populate({
    //   path: 'notifications.assignedBy'
    // });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.log("Users NOtification: ", user.notifications);
    
    return NextResponse.json(user.notifications);



  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  } 
}
