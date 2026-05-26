'use client'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import userContext from '@/context/userDetails/UserContext';

import React, { useEffect, useContext, useState } from 'react';
import { Typography } from '@mui/material';

function Page() {
    const context = useContext(userContext);
    const { user } = context;
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true); // New loading state

    const myID = user?._id;

    console.log("MY ID FROM QUIZZES:_", myID);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch('/api/getquiz');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                console.log("Data from /api/quiz", data);
                setQuizzes(data);
            } catch (error) {
                console.error('Failed to fetch quizzes from api/quiz:', error);
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };
        fetchQuizzes();
    }, [myID]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <Typography variant="h4" component="h1" align="start" gutterBottom sx={{ color: '#1976D2', fontWeight: 'bold' }}>
                Quizzes
            </Typography>

            <h1 className="text-xs text-gray-400 font-medium">
                your recently created quiz list
            </h1>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead className="bg-blue-500">
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                Quiz Name
                            </TableCell>
                            <TableCell align="right" sx={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                Assigned To
                            </TableCell>
                            <TableCell align="right" sx={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                Questions Length
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {quizzes.map((quiz) => (
                            <TableRow key={quiz._id}>
                                <TableCell component="th" scope="row">
                                    {quiz.name}
                                </TableCell>
                                <TableCell align="right">
                                    {quiz.assignedUsers.map((assignedUser) => assignedUser.name).join(', ')}
                                </TableCell>
                                <TableCell align="right">{quiz.questions.length}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Page;