import { NextResponse } from 'next/server';
import connectToDatabase from '@/db/db';
import User from '@/app/models/User';
import Quiz from '@/app/models/Quiz';

connectToDatabase();

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const assignerId = searchParams.get('assignerId');

        if (!assignerId) {
            return NextResponse.json({ error: 'Assigner ID is required' }, { status: 400 });
        }

        // 1. Find all users who have notifications from this assigner
        const users = await User.find({
            'notifications.assignedBy': assignerId
        }).select('name email notifications');

        const report = [];

        users.forEach(user => {
            user.notifications.forEach(notif => {
                if (notif.assignedBy.toString() === assignerId) {
                    report.push({
                        userName: user.name,
                        userEmail: user.email,
                        quizId: notif.quizId,
                        status: notif.status,
                        quizScore: notif.quizScore,
                        updatedAt: notif.updatedAt,
                        createdAt: notif.createdAt
                    });
                }
            });
        });

        // 2. Populate quiz names
        const quizIds = [...new Set(report.map(r => r.quizId))];
        const quizzes = await Quiz.find({ _id: { $in: quizIds } }).select('name');
        
        const quizMap = {};
        quizzes.forEach(q => quizMap[q._id.toString()] = q.name);

        const finalReport = report.map(r => ({
            ...r,
            quizName: quizMap[r.quizId.toString()] || 'Unknown Quiz'
        }));

        return NextResponse.json(finalReport);
    } catch (error) {
        console.error('Error fetching assignment report:', error);
        return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
    }
}
