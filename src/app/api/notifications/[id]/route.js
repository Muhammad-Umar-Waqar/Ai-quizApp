

// app/api/notifications/[id]/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../../models/User';
import connectToDatabase from '../../../../db/db';

connectToDatabase();
export async function PATCH(request) {
  try {
    // await connectToDatabase();
    const { id , status, quizScore } = await request.json();
    console.log("Received Data:", { id, status, quizScore }); // Log incoming data
    if (!id || !status) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const user = await User.findOne({ 'notifications._id': id });
    if (!user) {
      console.log("User not Found in notifications")
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    const notification = user.notifications.id(id);
    if (notification) {
      console.log("NOTIFICATION BEFORE UPDATE", notification)
      notification.status = status;
      notification.quizScore = quizScore;
      console.log("Assigning quizScore:", quizScore); 
      console.log("NOTIFICATION AFTER UPDATE", notification)
      await user.save();
      return NextResponse.json({ message: 'Notification status updated successfully' });
    } else {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

  } catch (error) {
    console.error('Error updating notification status:', error);
    return NextResponse.json({ error: 'Failed to update notification status' }, { status: 500 });
  }
}
