// app/api/logout/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {

    cookies().delete('token')
    cookies().delete('userId')
    return NextResponse.json({ message: 'Logged out successfully' });
}
