// app/api/signin/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../models/User';
import connectToDatabase from '../../../db/db';
import dotenv from 'dotenv';
import { cookies } from 'next/headers'
import { signinSchema } from '@/lib/validation/siginSchema';



dotenv.config();

connectToDatabase();
export async function POST(request) {
    // await connectToDatabase();
    try {
        const body = await request.json();

        // Validate the request body using signinSchema
        const result = signinSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
        }

        const { email, password } = result.data;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const token = user.generateToken();
        
        cookies().set('userId', user._id)
        cookies().set('token', token)
        return NextResponse.json({ message: 'Sign in successful', token });
    } catch (error) {
        console.error('Error signing in:', error);
        return NextResponse.json({ error: 'Failed to sign in' }, { status: 500 });
    } 
}
