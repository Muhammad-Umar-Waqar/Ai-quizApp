import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Validates and fixes a quiz JSON structure using AI to ensure it's perfect.
 */
const validateQuizWithAI = async (rawJson) => {
    const prompt = `
You are a JSON repair and quiz validation expert.
I have a generated quiz JSON that might have minor structural issues or formatting errors.
Your task is to:
1. Ensure it is a valid JSON array.
2. Ensure each object has: "type", "questionText", and the specific fields for that type.
   - MCQs: "options" (4 strings) and "correctOption" (number 0-3).
   - True/False Questions: "correctOption" (1 for True, 0 for False).
   - Fill in the Blanks: "correctAnswer" (string).
3. If any field is missing, infer a sensible value based on the question text.
4. Return ONLY the valid JSON array. No text, no markdown.

Raw JSON to fix:
${rawJson}
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        }),
    });

    
    if (!response.ok) return null; // Fallback to original parsing if validator fails

    const result = await response.json();
    return result.candidates[0].content.parts[0].text;
};

const generateQuiz = async (quizName) => {
    const prompt = `
Generate 5 quiz questions based on the topic: "${quizName}".
The mix MUST include:
- 2 MCQs (type: "MCQs", with "options" array of 4 strings and "correctOption" as index 0-3)
- 2 True/False questions (type: "True/False Questions", with "correctOption" as 1 for True or 0 for False)
- 1 Fill in the Blank question (type: "Fill in the Blanks", with "correctAnswer" as string)

Return ONLY a raw JSON array.
[
  { "type": "MCQs", "questionText": "Question?", "options": ["A", "B", "C", "D"], "correctOption": 0 },
  { "type": "True/False Questions", "questionText": "Statement?", "correctOption": 1 },
  { "type": "Fill in the Blanks", "questionText": "Question with ___?", "correctAnswer": "ans" }
]
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        }),
    });

    console.log("generateQuiz Error", response)

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API Error: ${response.status}`);
    }

    const result = await response.json();
    let generatedText = result.candidates[0].content.parts[0].text;

    // AI Validation Step: Ensure the JSON is actually valid and structured correctly
    const validatedText = await validateQuizWithAI(generatedText);
    
    // Use validated text if available, otherwise fall back to original and sanitize
    const finalJsonText = validatedText || generatedText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
        return JSON.parse(finalJsonText);
    } catch (e) {
        console.error("Final JSON Parse Error:", finalJsonText);
        throw new Error('AI generated invalid data structure. Please try again.');
    }
};

export async function POST(request) {
    try {
        const { inputText } = await request.json();

        if (!inputText) {
            return NextResponse.json({ error: 'Quiz name is required' }, { status: 400 });
        }

        const quizQuestions = await generateQuiz(inputText);

        return NextResponse.json({ 
            message: 'Questions generated and AI-validated successfully!', 
            quizQuestions 
        });
    } catch (error) {
        console.error("Route Handler Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
