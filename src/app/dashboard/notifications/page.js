'use client'

import React, { useContext, useEffect, useState } from 'react';
import userContext from '@/context/userDetails/UserContext';
import { useRouter } from 'next/navigation';
import { Container, Typography, Card, CardContent, Button, Grid, CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { toast } from 'react-toastify';

function NotificationsPage() {
    const router = useRouter();
    const context = useContext(userContext);
    const { user } = context;
    const current_notifications = user?.notifications;

    const myID = user?._id;
   

    console.log("user", user);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (myID) {
                    const response = await fetch(`/api/notifications?userId=${myID}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch notifications');
                    }
                    const data = await response.json();
                    setNotifications(data);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [myID, current_notifications]);

    const handleNotificationClick = async (notificationId, quizId) => {
        // Mark the notification as read or started, but NOT completed yet
        await fetch(`/api/notifications/${notificationId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: notificationId, status: 'started', quizScore: 0 }),
        });

        // Redirect to the quiz page with the selected quizId
        router.push(`/dashboard/attempt-quiz/${quizId._id}`);
        localStorage.setItem("notificationId", notificationId);
    };


    const changeNotificationStatus = async (notificationId) => {
        // Mark the notification as read
        setOpen(true);

        const res = await fetch(`/api/notifications/${notificationId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: notificationId, status: 'read', quizScore: 0 }),
        });


        if (res.ok) {
            // Update the local notifications state
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification._id === notificationId
                        ? { ...notification, status: 'read' }
                        : notification
                )
            );
        }
        
        console.log("Res", res)

        localStorage.setItem("notificationId", notificationId);
    };

    const completedQuizzes = notifications.filter(n => n.status === 'completed');
    const attemptedQuizzes = notifications.filter(n => n.status !== 'completed');


    const HandleAccept = async (userId, requestSenderID ) =>{
        console.log("user ID", userId, "Request Sender ID", requestSenderID);
        if (!userId || !requestSenderID) {
            toast.error('Please select a userId and requestSenderId.');
            return;
        }

        const res = await fetch("/api/acceptRequest", {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId, friendId: requestSenderID}),
        });
        if (res.ok){
            toast.success("Friend Request Accepted");
        }
    }

    const HandleReject = async (userId, requestSenderID ) =>{
        console.log("user ID", userId, "Request Sender ID", requestSenderID);
        if (!userId || !requestSenderID) {
            toast.error('Please select a userId and requestSenderId.');
            return;
        }

        const res = await fetch("/api/rejectRequest", {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId, friendId: requestSenderID}),
        });
        if (res.ok){
            toast.success("Friend Request Rejected");
        }
        if(res.error){
            toast.success("Error in Frend Request", res.error);
        }
    
    }



    const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ color: '#1976D2', fontWeight: 'bold' }}>
                Notifications
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '60vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box>
                    <Typography variant="h5" component="h2" sx={{ my: 2, color: '#1976D2', fontWeight: 'bold' }}>
                        Attempt Quiz
                    </Typography>
                    {attemptedQuizzes.length > 0 ? (
                        <Grid container spacing={3}>
                            {attemptedQuizzes.map((notification) => (
                                <Grid item xs={12} sm={6} md={4} key={notification._id}>
                                    <Card sx={{ minWidth: 275, boxShadow: 3 }}>
                                        <CardContent>
                                            <Typography variant="h6" component="div">
                                                Assigned By: {notification.assignedBy.name}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Status: {notification.status}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Score: {notification.quizScore.toFixed(2)}
                                            </Typography>
                                            



                                            {/* <Button variant="outlined" onClick={handleClickOpen}>
                                                Read
                                            </Button> */}

                                            <Button
                                                //  onClick={handleClickOpen}

                                                 onClick={() => changeNotificationStatus(notification._id)}
                                                variant="contained"
                                                color="primary"
                                                sx={{ mt: 2 }}
                                            >
                                                Read Quiz Details
                                            </Button>

                                            
                                            <Dialog
                                                open={open}
                                                onClose={handleClose}
                                               
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description"
                                            >
                                                <DialogTitle id="alert-dialog-title">
                                                    {"Want to Start a Quiz Now?"}
                                                </DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-description">
                                                    Once you begin the quiz by clicking <span className="font-semibold">Start</span>, you will not have the option to attempt it again. Ensure that you complete it in one session
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                 

                                                    <Button
                                               onClick={handleClose}
                                                variant="contained"
                                                color="primary"
                                                sx={{ mt: 2 }}
                                            >
                                                Close
                                            </Button>
                                                    <Button
                                                onClick={() => handleNotificationClick(notification._id, notification.quizId)}
                                                variant="contained"
                                                color="primary"
                                                sx={{ mt: 2 }}
                                            >
                                                Start Quiz
                                            </Button>
                                                </DialogActions>
                                            </Dialog>


                                            
                                       
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant="h6" align="center" color="text.secondary">
                            No attempted quizzes
                        </Typography>
                    )}

                    <Typography variant="h5" component="h2" sx={{ my: 4, color: '#1976D2', fontWeight: 'bold' }}>
                        Completed Quizzes
                    </Typography>
                    {completedQuizzes.length > 0 ? (
                        <Grid container spacing={3}>
                            {completedQuizzes.map((notification) => (
                                <Grid item xs={12} sm={6} md={4} key={notification._id}>
                                    <Card sx={{ minWidth: 275, boxShadow: 3 }}>
                                        <CardContent>
                                            <Typography variant="h6" component="div">
                                                Assigned By: {notification.assignedBy.name}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Status: {notification.status}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Score: {notification.quizScore.toFixed(2)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                    ) : (
                        <Typography variant="h6" align="center" color="text.secondary">
                            No completed quizzes
                        </Typography>
                    )}


<Typography variant="h5" component="h2" sx={{ my: 4, color: '#1976D2', fontWeight: 'bold' }}>
                        Friend Requests
                    </Typography>
                        <Grid container spacing={3}>
                            {user?.friendRequestNotification?.map((user) => (
                                <Grid item xs={12} sm={6} md={4} key={user.sender}>
                                    <Card sx={{ minWidth: 275, boxShadow: 3 }}>
                                        <CardContent>
                                            <Typography variant="h6" component="div">
                                                Name: {user.friendName}
                                            </Typography>
                                            <Typography variant="h6" component="div">
                                                Status: {user.status === "Pending" ?  <Button onClick={()=>HandleAccept( myID, user?.sender)}>Accept Request</Button>: user.status }
                                            </Typography>
                                            <Typography variant="h6" component="div">
                                                 {user.status === "Accepted" || user.status === "Pending"  ?  <Button onClick={()=>HandleReject( myID, user?.sender)}>Reject Request</Button>: "" }
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
            )}
        </Container>
    );
}

export default NotificationsPage;
