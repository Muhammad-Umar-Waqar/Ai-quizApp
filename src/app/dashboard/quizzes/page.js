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
import Chip from '@mui/material/Chip';

import React, { useEffect, useContext, useState } from 'react';
import { Typography, Divider } from '@mui/material';

function QuizzesPage() {
    const context = useContext(userContext);
    const { user } = context;
    const [quizzes, setQuizzes] = useState([]);
    const [report, setReport] = useState([]);
    const [loadingQuizzes, setLoadingQuizzes] = useState(true);
    const [loadingReport, setLoadingReport] = useState(true);

    const myID = user?._id;

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch('/api/getquiz');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setQuizzes(data);
            } catch (error) {
                console.error('Failed to fetch quizzes:', error);
            } finally {
                setLoadingQuizzes(false);
            }
        };

        const fetchReport = async () => {
            if (!myID) return;
            try {
                const response = await fetch(`/api/assignment-report?assignerId=${myID}`);
                if (!response.ok) throw new Error('Failed to fetch report');
                const data = await response.json();
                setReport(data);
            } catch (error) {
                console.error('Failed to fetch assignment report:', error);
            } finally {
                setLoadingReport(false);
            }
        };

        fetchQuizzes();
        fetchReport();
    }, [myID]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'started': return 'warning';
            case 'read': return 'info';
            case 'Pending': return 'default';
            default: return 'default';
        }
    };

    if (loadingQuizzes && loadingReport) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection="column" gap={6}>
            {/* Section 1: Your Created Quizzes */}
            <Box>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1976D2', fontWeight: 'bold' }}>
                    Your Quizzes
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    List of quizzes you have created.
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: '#1976D2' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quiz Name</TableCell>
                                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Questions Count</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {quizzes.map((quiz) => (
                                <TableRow key={quiz._id} hover>
                                    <TableCell component="th" scope="row">{quiz.name}</TableCell>
                                    <TableCell align="right">{quiz.questions.length}</TableCell>
                                </TableRow>
                            ))}
                            {quizzes.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} align="center">No quizzes created yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Divider />

            {/* Section 2: Assignment Performance Tracker */}
            <Box>
                <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#FF6F61', fontWeight: 'bold' }}>
                    Performance Tracker
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Track the progress and scores of users you've assigned quizzes to.
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: '#FF6F61' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User Name</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quiz Assigned</TableCell>
                                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Score (%)</TableCell>
                                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Last Updated</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {report.map((row, index) => (
                                <TableRow key={index} hover>
                                    <TableCell>{row.userName}</TableCell>
                                    <TableCell>{row.quizName}</TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={row.status} 
                                            color={getStatusColor(row.status)} 
                                            size="small" 
                                            variant="outlined" 
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography sx={{ fontWeight: 'bold', color: row.status === 'completed' ? '#2e7d32' : 'inherit' }}>
                                            {row.status === 'completed' ? `${row.quizScore.toFixed(1)}%` : '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        {new Date(row.updatedAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {report.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">No assignments tracked yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default QuizzesPage;
