'use client'
import React, { useState, useEffect, useContext } from 'react';
import { Container, FormControl, InputLabel, Select, MenuItem, Button, Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import userContext from '@/context/userDetails/UserContext';

function AssignQuizPage() {
    const [users, setUsers] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [loading, setLoading] = useState(true);
    const context = useContext(userContext);
    const { user } = context;
    const [quizzes, setQuizzes] = useState([]);

    const myID = user?._id;

    console.log("MY ID FROM QUIZZES:_", myID);

    useEffect(() => {
        const fetchQuizzes = async () => {
            const response = await fetch('/api/getquiz');
            const data = await response.json();
            setQuizzes(data);
        };

        const fetchUsers = async () => {
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(data);
        };

        Promise.all([fetchQuizzes(), fetchUsers()]).then(() => setLoading(false));
    }, []);

    
    const handleAssignQuiz = async () => {
        if (!selectedUser || !selectedQuiz || !myID) {
            console.error('User or quiz not selected');
            toast.error("User or Quiz Not Selected");
            return;
        }

        const response = await fetch('/api/assign', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: selectedUser, quizId: selectedQuiz, assignedBy: myID }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Quiz assigned successfully:', result);
            toast.success("Quiz Assigned Successfully");
        } else {
            if (response.status === 403) {
                toast.error("User is not in your Friends List");
            } else if (response.status === 400 && result.error === 'Quiz already assigned to this user') {
                toast.warning("Quiz is already assigned to this user");
            } else {
                console.error('Error assigning quiz:', result.error);
                toast.error(result.error || "Failed to assign quiz");
            }
        }
    };

    return (
        <div >
        <Container maxWidth="md" sx={{ display: 'flex', flexDirection:"column", justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
             
            <Card sx={{ minWidth: 500, boxShadow: 5, padding:"32px",  borderRadius: 4 }}>
                <CardContent>
                    <Typography variant="h4" component="div" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976D2' }}>
                        Assign Quiz to User
                    </Typography>
                    <Box mt={3} display="flex" flexDirection="column" gap={3}>
                        {loading ? (
                            <Box display="flex" justifyContent="center">
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="select-quiz-label">Select Quiz</InputLabel>
                                    <Select
                                        labelId="select-quiz-label"
                                        value={selectedQuiz}
                                        onChange={(e) => setSelectedQuiz(e.target.value)}
                                        label="Select Quiz"
                                    >
                                        {quizzes.map((quiz) => (
                                            <MenuItem key={quiz._id} value={quiz._id}>
                                                {quiz.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="select-user-label">Select User</InputLabel>
                                    <Select
                                        labelId="select-user-label"
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(e.target.value)}
                                        label="Select User"
                                    >
                                        {users.map((user) => (
                                            <MenuItem key={user._id} value={user._id}>
                                                {user.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAssignQuiz}
                                    sx={{
                                        background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        marginTop: "20px",
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #1976D2 60%, #21CBF3 100%)',
                                        },
                                    }}
                                >
                                    Assign Quiz
                                </Button>
                            </>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Container>
        </div>
    );
}

export default AssignQuizPage;
