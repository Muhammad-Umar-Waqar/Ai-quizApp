import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../models/User';
import Quiz from '../../models/Quiz';
import connectToDatabase from '../../../db/db';
import dotenv from 'dotenv';

dotenv.config();

connectToDatabase();

export async function POST(request) {
  try {
    const { userId, quizId, assignedBy } = await request.json();

    // Check if all required fields are provided
    if (!userId || !quizId || !assignedBy) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    // Validate MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || 
        !mongoose.Types.ObjectId.isValid(quizId) || 
        !mongoose.Types.ObjectId.isValid(assignedBy)) {
      return NextResponse.json({ error: 'Invalid IDs provided' }, { status: 400 });
    }

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Find the user by ID (user who is receiving the quiz)
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the user who is assigning the quiz (assignedBy)
    const assigner = await User.findById(assignedBy);
    console.log("ASSSIGNER IS ", assigner._id, "AND user is ", user._id);

    const rightAssigner = assigner.friends.find(
      f => f.friend.toString() == user._id && f.status == "Accepted"
    );

      console.log("Right Assigner", rightAssigner)

    

    // Check if they are friends
    if (!rightAssigner) {
      return NextResponse.json({ error: 'Users are not friends' }, { status: 403 });
    };

    if(rightAssigner){
    // Add user to assignedUsers if not already assigned
    if (!quiz.assignedUsers.includes(userId)) {
      quiz.assignedUsers.push(userId);
      await quiz.save();
    }

    // Add notification only if it doesn't already exist for the same quiz
    const existingNotification = user.notifications.find(
      notification => notification.quizId.toString() === quizId
    );
    
    if (!existingNotification) {
      user.notifications.push({
        quizId: quiz._id,
        assignedBy,
        status: 'Pending',
        createdAt: new Date()  // Add a timestamp for when the quiz was assigned
      });
      await user.save();
      return NextResponse.json({ message: 'Quiz assigned successfully' });
    } else {
      return NextResponse.json({ error: 'Quiz already assigned to this user' }, { status: 400 });
    }
  }
  } catch (error) {
    console.error('Error assigning quiz:', error);
    return NextResponse.json({ error: 'Failed to assign quiz' }, { status: 500 });
  }
}
