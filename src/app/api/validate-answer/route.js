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

        // Basic validation: if answers match exactly (case-insensitive), consider correct
        if (correctAnswer.trim().toLowerCase() === userAnswer.trim().toLowerCase()) {
            return NextResponse.json({
                isCorrect: true,
                explanation: "Answer matches exactly"
            });
        }

        // If Gemini API key is not configured, use basic string comparison
        if (!GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not configured, using basic validation');
            return NextResponse.json({
                isCorrect: false,
                explanation: "AI validation unavailable. Answer doesn't match exactly."
            });
        }

        const prompt = `
Question: "${questionText}"
Reference Answer: "${correctAnswer}"
User Answer: "${userAnswer}"

Is the user's answer semantically correct compared to the reference answer for this question?
Respond with ONLY a JSON object: { "isCorrect": boolean, "explanation": "brief reason" }
`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Gemini API error:', response.status, errorText);
                throw new Error(`Gemini API returned ${response.status}`);
            }

            const result = await response.json();
            const generatedText = result.candidates[0].content.parts[0].text;
            const validation = JSON.parse(generatedText);

            return NextResponse.json(validation);
        } catch (fetchError) {
            clearTimeout(timeoutId);

            // If fetch fails (timeout, network error, etc.), fall back to basic comparison
            console.error('Gemini API fetch failed:', fetchError.message);

            // Simple similarity check as fallback
            const similarity = calculateSimilarity(correctAnswer.toLowerCase(), userAnswer.toLowerCase());

            return NextResponse.json({
                isCorrect: similarity > 0.6,
                explanation: similarity > 0.6
                    ? "Answer is similar to the correct answer (AI validation unavailable)"
                    : "Answer doesn't match the expected answer (AI validation unavailable)"
            });
        }
    } catch (error) {
        console.error("Validation Error:", error);
        return NextResponse.json({
            error: 'Validation failed',
            message: error.message
        }, { status: 500 });
    }
}

// Simple similarity calculation (Levenshtein distance-based)
function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) {
        return 1.0;
    }

    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
}
