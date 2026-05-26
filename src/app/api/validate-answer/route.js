import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request) {
    try {
        const { questionText, correctAnswer, userAnswer } = await request.json();

        if (!questionText || !correctAnswer || !userAnswer) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const prompt = `
Question: "${questionText}"
Reference Answer: "${correctAnswer}"
User Answer: "${userAnswer}"

Is the user's answer semantically correct compared to the reference answer for this question?
Respond with ONLY a JSON object: { "isCorrect": boolean, "explanation": "brief reason" }
`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            }),
        });

        if (!response.ok) {
            throw new Error('Gemini API validation failed');
        }

        const result = await response.json();
        const generatedText = result.candidates[0].content.parts[0].text;
        const validation = JSON.parse(generatedText);

        return NextResponse.json(validation);
    } catch (error) {
        console.error("Validation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
