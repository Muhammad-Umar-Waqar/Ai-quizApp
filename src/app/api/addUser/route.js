// app/api/signup/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../models/User';
import connectToDatabase from '../../../db/db'
import dotenv from 'dotenv';
import { signupSchema } from '@/lib/validation/signupSchema';

dotenv.config();

connectToDatabase();
export async function POST(request) {
  try {
    // await connectToDatabase();
    // const { name, email, password } = await request.json();

    const body = await request.json();

    // Validate the request body using signupSchema
    const result = signupSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json({ error: result.error}, { status: 400 });
    }

    const { name, email, password } = result.data;

    // Ensure the password field is provided
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create a new user with a hashed password
    const newUser = new User({ name, email, password });
    await newUser.save();

    return NextResponse.json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
