// 'use client';
// import { MenuItem } from '@mui/material';
// import React, { useContext, useEffect, useState } from 'react';
// import userContext from '@/context/userDetails/UserContext';
// import { toast } from 'react-toastify';

// function Page() {
//     const context = useContext(userContext);
//     const { user } = context;
//     const myID = user?._id;

//     const [friends, setFriends] = useState([]);
//     const [nonFriends, setNonFriends] = useState([]);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await fetch('/api/users');
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch users');
//                 }
//                 const data = await response.json();
                
//                 console.log("Data is " , data);
                
//                 // Separate friends and non-friends
//                 const userFriends = data.filter(friend => 
//                     friend.friends?.some(f => f.friend === myID && f.status == "Accepted")
//                 );
//                 console.log(userFriends);
                
//                 const userNonFriends = data.filter(nonFriend => 
//                     !nonFriend.friends?.some(f => f.friend === myID && f.status == "Accepted") && nonFriend._id !== myID
//                 );
//                 console.log(userNonFriends);

//                 setFriends(userFriends);
//                 setNonFriends(userNonFriends);
//                 console.log("Friends:", userFriends);
//                 console.log("Non-Friends:", userNonFriends);
//             } catch (err) {
//                 setError(err.message);
//                 console.error("Error fetching users: ", err);
//             }
//         };
//         fetchUsers();
//     }, [myID]);

//     const sendRequest = async (friendId, myId) => {
//         console.log("USER AND FRIEND ID:", friendId, myId);

//         const response = await fetch('/api/sendRequest', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ userId: myId, friendId }),
//         });

//         if (response.status === 406) {
//             toast.error("User or Friend ID Not Found");
//         } else if (response.status === 500) {
//             toast.error("Failed To send Friend Request");
//         } else if (response.ok) {
//             const result = await response.json();
//             console.log('User Request Sent Successfully:', result);
//             toast.success("User Request Sent Successfully");
//         } else {
//             toast.error("Unknown Error");
//         }
//     };

//     if (error) {
//         return <div>Error: {error}</div>;
//     }



    
//     const HandleReject = async (userId, requestSenderID ) =>{
//         console.log("user ID", userId, "Request Sender ID", requestSenderID);
//         if (!userId || !requestSenderID) {
//             toast.error('Please select a userId and requestSenderId.');
//             return;
//         }

//         const res = await fetch("/api/rejectRequest", {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ userId: userId, friendId: requestSenderID}),
//         });
//         if (res.ok){
//             toast.success("Friend Request Rejected");
//         }
//         if(res.error){
//             toast.success("Error in Frend Request", res.error);
//         }
    
//     }

//     return (
//         <div className="flex gap-8">
//             {/* Friends Column */}
//             <div className="w-1/2">
//                 <h2>Friends</h2>
//                 {friends.length > 0 ? (
//                     friends.map((friend) => (
//                         <div key={friend._id} className="friend">
//                             <p>{friend.name}</p>
//                             <button
//                                 className="bg-blue-500 text-white rounded-md p-2 m-1"
//                                 onClick={() => HandleReject(friend._id, myID)}
//                             >
//                                  Un Follow 
//                             </button>
//                         </div>
//                     ))
//                 ) : (
//                     <MenuItem>No friends found</MenuItem>
//                 )}
//             </div>

//             {/* Non-Friends Column */}
//             <div className="w-1/2">
//                 <h2>Non-Friends</h2>
//                 {nonFriends.length > 0 ? (
//                     nonFriends.map((nonFriend) => (
//                         <div key={nonFriend._id} className="non-friend">
//                             <p>{nonFriend.name}</p>
//                             <button
//                                 className="bg-blue-500 text-white rounded-md p-2 m-1"
//                                 onClick={() => sendRequest(nonFriend._id, myID)}
//                             >
//                                 Send Friend Request
//                             </button>
//                         </div>
//                     ))
//                 ) : (
//                     <MenuItem>No non-friends found</MenuItem>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Page;











// 'use client';
// import { MenuItem, TextField, CircularProgress } from '@mui/material';
// import React, { useContext, useEffect, useState } from 'react';
// import userContext from '@/context/userDetails/UserContext';
// import { toast } from 'react-toastify';

// function Page() {
//     const context = useContext(userContext);
//     const { user } = context;
//     const myID = user?._id;

//     const [friends, setFriends] = useState([]);
//     const [nonFriends, setNonFriends] = useState([]);
//     const [filteredFriends, setFilteredFriends] = useState([]);
//     const [filteredNonFriends, setFilteredNonFriends] = useState([]);
//     const [searchFriends, setSearchFriends] = useState('');
//     const [searchNonFriends, setSearchNonFriends] = useState('');
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             setLoading(true);
//             try {
//                 const response = await fetch('/api/users');
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch users');
//                 }
//                 const data = await response.json();

//                 // Separate friends and non-friends
//                 const userFriends = data.filter(friend => 
//                     friend.friends?.some(f => f.friend === myID && f.status === "Accepted")
//                 );

//                 const userNonFriends = data.filter(nonFriend => 
//                     !nonFriend.friends?.some(f => f.friend === myID && f.status === "Accepted") && nonFriend._id !== myID
//                 );

//                 setFriends(userFriends);
//                 setFilteredFriends(userFriends);
//                 setNonFriends(userNonFriends);
//                 setFilteredNonFriends(userNonFriends);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchUsers();
//     }, [myID]);

//     useEffect(() => {
//         setFilteredFriends(
//             friends.filter(friend =>
//                 friend.name.toLowerCase().includes(searchFriends.toLowerCase())
//             )
//         );
//     }, [searchFriends, friends]);

//     useEffect(() => {
//         setFilteredNonFriends(
//             nonFriends.filter(nonFriend =>
//                 nonFriend.name.toLowerCase().includes(searchNonFriends.toLowerCase())
//             )
//         );
//     }, [searchNonFriends, nonFriends]);

//     const sendRequest = async (friendId, myId) => {
//         const response = await fetch('/api/sendRequest', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ userId: myId, friendId }),
//         });

//         if (response.status === 406) {
//             toast.error("User or Friend ID Not Found");
//         } else if (response.status === 500) {
//             toast.error("Failed To send Friend Request");
//         } else if (response.ok) {
//             toast.success("User Request Sent Successfully");
//         } else {
//             toast.error("Unknown Error");
//         }
//     };

//     const HandleReject = async (userId, requestSenderID) => {
//         if (!userId || !requestSenderID) {
//             toast.error('Please select a userId and requestSenderId.');
//             return;
//         }

//         const res = await fetch("/api/rejectRequest", {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ userId, friendId: requestSenderID }),
//         });
//         if (res.ok) {
//             toast.success("Friend Request Rejected");
//         } else {
//             toast.error("Error in Friend Request");
//         }
//     };

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div className="container mx-auto p-4 flex flex-col gap-8 lg:flex-row">
//             {/* Friends Column */}
//             <div className="lg:w-1/2 w-full">
//                 <h2 className="text-2xl font-semibold mb-4">Friends</h2>
//                 <TextField
//                     label="Search Friends"
//                     variant="outlined"
//                     fullWidth
//                     value={searchFriends}
//                     onChange={(e) => setSearchFriends(e.target.value)}
//                     className="mb-4"
//                 />
//                 {loading ? (
//                     <div className="flex justify-center"><CircularProgress /></div>
//                 ) : (
//                     <div>
//                         {filteredFriends.length > 0 ? (
//                             filteredFriends.map((friend) => (
//                                 <div key={friend._id} className="friend flex items-center justify-between p-2 bg-gray-100 rounded-lg mb-2">
//                                     <p>{friend.name}</p>
//                                     <button
//                                         className="bg-red-500 text-white rounded-md p-2"
//                                         onClick={() => HandleReject(friend._id, myID)}
//                                     >
//                                         Unfollow
//                                     </button>
//                                 </div>
//                             ))
//                         ) : (
//                             <MenuItem>No friends found</MenuItem>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* Non-Friends Column */}
//             <div className="lg:w-1/2 w-full">
//                 <h2 className="text-2xl font-semibold mb-4">Non-Friends</h2>
//                 <TextField
//                     label="Search Non-Friends"
//                     variant="outlined"
//                     fullWidth
//                     value={searchNonFriends}
//                     onChange={(e) => setSearchNonFriends(e.target.value)}
//                     className="mb-4"
//                 />
//                 {loading ? (
//                     <div className="flex justify-center"><CircularProgress /></div>
//                 ) : (
//                     <div>
//                         {filteredNonFriends.length > 0 ? (
//                             filteredNonFriends.map((nonFriend) => (
//                                 <div key={nonFriend._id} className="non-friend flex items-center justify-between p-2 bg-gray-100 rounded-lg mb-2">
//                                     <p>{nonFriend.name}</p>
//                                     <button
//                                         className="bg-blue-500 text-white rounded-md p-2"
//                                         onClick={() => sendRequest(nonFriend._id, myID)}
//                                     >
//                                         Send Friend Request
//                                     </button>
//                                 </div>
//                             ))
//                         ) : (
//                             <MenuItem>No non-friends found</MenuItem>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Page;



































'use client';
import { MenuItem, TextField, CircularProgress, Button, Typography, Card, CardContent, Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import userContext from '@/context/userDetails/UserContext';
import { toast } from 'react-toastify';


function Page() {
    const context = useContext(userContext);
    const { user } = context;
    console.log("USer is in friends", user);
    
    const myID = user?._id;

    const [friends, setFriends] = useState([]);
    const [nonFriends, setNonFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [filteredNonFriends, setFilteredNonFriends] = useState([]);
    const [searchFriends, setSearchFriends] = useState('');
    const [searchNonFriends, setSearchNonFriends] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [disableButton, setDisableButton] = useState(false);

    // Pagination state
    const [friendsDisplayCount, setFriendsDisplayCount] = useState(10);
    const [nonFriendsDisplayCount, setNonFriendsDisplayCount] = useState(10);
    const [friendRequests, setFriendRequests] = useState(user?.friendRequestNotification || []);


    useEffect(() => {
        // Keep the local state in sync with user data initially
        setFriendRequests(user?.friendRequestNotification || []);
    }, [user]);


    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();

                const userFriends = data.filter(friend =>
                    friend.friends?.some(f => f.friend === myID && f.status === "Accepted")
                );

                
                

                const userNonFriends = data.filter(nonFriend =>
                    !nonFriend.friends?.some(f => f.friend === myID && f.status === "Accepted") && nonFriend._id !== myID
                );

                console.log("userNonFriends: ", userNonFriends);

                setFriends(userFriends);
                setFilteredFriends(userFriends);
                setNonFriends(userNonFriends);
                setFilteredNonFriends(userNonFriends);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [myID]);


    useEffect(() => {
        setFilteredFriends(
            friends.filter(friend =>
                friend.name.toLowerCase().includes(searchFriends.toLowerCase())
            )
            );
        console.log("filteredFriends", filteredFriends)
    }, [searchFriends, friends]);
    
    useEffect(() => {
        setFilteredNonFriends(
            nonFriends.filter(nonFriend =>
                nonFriend.name.toLowerCase().includes(searchNonFriends.toLowerCase())
            )
        );
        console.log("filteredNonfriends", filteredNonFriends)
    }, [searchNonFriends, nonFriends]);

    // const sendRequest = async (friendId, myId) => {
    //     setDisableButton(true);

    //     try {
    //         const response = await fetch('/api/sendRequest', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ userId: myId, friendId }),
    //         });
    
    //         if (response.status === 406) {
    //             toast.error("User or Friend ID Not Found");
    //         } else if (response.status === 500) {
    //             toast.error("Failed To send Friend Request");
    //         } else if (response.ok) {
    //             toast.success("User Request Sent Successfully");
    //         } else {
    //             toast.error("Unknown Error");
    //         }
    //     } catch (error) {
    //         toast.error(error);
    //     } finally{
    //         setDisableButton(false);
    //     }
       

    // };


    const sendRequest = async (friendId, myId) => {
        setDisableButton(true);
    
        try {
            const response = await fetch('/api/sendRequest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: myId, friendId }),
            });
            if (response.status === 405){
                toast.error("Friend Request Already Sent");
            }
            if (response.status === 406) {
                toast.error("User or Friend ID Not Found");
            } else if (response.status === 500) {
                toast.error("Failed To send Friend Request");
            } else if (response.ok) {
                toast.success("User Request Sent Successfully");
    
                // Remove the user from nonFriends and filteredNonFriends lists
                setNonFriends(prevNonFriends => prevNonFriends.filter(nonFriend => nonFriend._id !== friendId));
                setFilteredNonFriends(prevFilteredNonFriends => prevFilteredNonFriends.filter(nonFriend => nonFriend._id !== friendId ));
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setDisableButton(false);
        }
    };


    useEffect(() => {
        const changeStatus = async () => {
          try {
            if (myID) {
              const res = await fetch('/api/changeviewStatus', {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: myID }),
              });
      
              if (res.ok) {
                console.log("Response is OK", res);
              } else {
                const errorData = await res.json();
                toast.error(errorData.error);
              }
            }
          } catch (error) {
            toast.error("Failed to update view status");
          }
        };
      
        changeStatus();
      }, [myID]);
      
      
    

    // const HandleReject = async (userId, requestSenderID) => {

    //     if (!userId || !requestSenderID) {
    //         toast.error('Please select a userId and requestSenderId.');
    //         return;
    //     }

    //     try {
    //         const res = await fetch("/api/rejectRequest", {
    //             method: 'PATCH',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ userId, friendId: requestSenderID }),
    //         });

    //         if (res.ok) {
    //             toast.success("Friend Request Rejected");
    //             setFriendRequests((prevRequest)=> prevRequest.map((user)=> user.sender === requestSenderID ? {...user, status : "rejected" } : user ) )

    //         } else {
    //             toast.error("Error in Friend Request");
    //         }
    //         setFilteredFriends(prevFilteredFriends => prevFilteredFriends.filter(filteredFriends => filteredFriends._id !== userId));
    //         setFriends(prevFriends => prevFriends.filter(friends => friends._id !== userId));
    //     } catch (error) {
    //         toast.error(error)
    //     }  
    // };



    // const HandleAccept = async (userId, requestSenderID ) =>{
    //     console.log("user ID", userId, "Request Sender ID", requestSenderID);
    //     if (!userId || !requestSenderID) {
    //         toast.error('Please select a userId and requestSenderId.');
    //         return;
    //     }

    //     const res = await fetch("/api/acceptRequest", {
    //         method: 'PATCH',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ userId: userId, friendId: requestSenderID}),
    //     });
    //     if (res.ok){
    //         toast.success("Friend Request Accepted");
    //         setFriendRequests((prevRequest)=> prevRequest.map((user)=> user.sender === requestSenderID ? {...user, status : "Accepted" } : user ) )

    //     }
    // }

    

    const HandleAccept = async (userId, requestSenderID) => {
        console.log("user ID", userId, "Request Sender ID", requestSenderID);
        if (!userId || !requestSenderID) {
            toast.error('Please select a userId and requestSenderId.');
            return;
        }
    
        try {
            const res = await fetch("/api/acceptRequest", {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, friendId: requestSenderID }),
            });
    
            if (res.ok) {
                toast.success("Friend Request Accepted");
    
                // Move the user from Non-Friends to Friends
                setNonFriends(prevNonFriends => prevNonFriends.filter(nonFriend => nonFriend._id !== requestSenderID));
                setFilteredNonFriends(prevFilteredNonFriends => 
                    prevFilteredNonFriends.filter(nonFriend => nonFriend._id !== requestSenderID)
                );
    
                const acceptedFriend = nonFriends.find(nonFriend => nonFriend._id === requestSenderID);
                if (acceptedFriend) {
                    setFriends(prevFriends => [...prevFriends, acceptedFriend]);
                    setFilteredFriends(prevFilteredFriends => [...prevFilteredFriends, acceptedFriend]);
                }
    
                // Update the friend request status
                setFriendRequests(prevRequest => 
                    prevRequest.map(user => 
                        user.sender === requestSenderID ? { ...user, status: "Accepted" } : user
                    )
                );
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    
    const HandleReject = async (userId, requestSenderID) => {
        if (!userId || !requestSenderID) {
            toast.error('Please select a userId and requestSenderId.');
            return;
        }
    
        try {
            const res = await fetch("/api/rejectRequest", {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, friendId: requestSenderID }),
            });
    
            if (res.ok) {
                toast.success("Friend Request Rejected");
    
                // Move the user from Friends to Non-Friends
                setFriends(prevFriends => prevFriends.filter(friend => friend._id !== requestSenderID));
                setFilteredFriends(prevFilteredFriends => 
                    prevFilteredFriends.filter(friend => friend._id !== requestSenderID)
                );
    
                const rejectedFriend = friends.find(friend => friend._id === requestSenderID);
                if (rejectedFriend) {
                    setNonFriends(prevNonFriends => [...prevNonFriends, rejectedFriend]);
                    setFilteredNonFriends(prevFilteredNonFriends => [...prevFilteredNonFriends, rejectedFriend]);
                }
    
                // Update the friend request status
                setFriendRequests(prevRequest => 
                    prevRequest.map(user => 
                        user.sender === requestSenderID ? { ...user, status: "rejected" } : user
                    )
                );
            } else {
                toast.error("Error in Friend Request");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    





    if (error) {
        return <div>Error: {error}</div>;
    }

    

    return (
        <>
        
        <div className="container mx-auto p-4 flex flex-col gap-8 lg:flex-row">
            {/* Friends Column */}
            <div className="lg:w-1/2 w-full">
                <h2 className="text-2xl font-semibold mb-4">Friends</h2>
                <TextField
                    label="Search Friends"
                    variant="outlined"
                    fullWidth
                    value={searchFriends}
                    onChange={(e) => setSearchFriends(e.target.value)}
                    className="mb-4"
                />
                {loading ? (
                    <div className="flex justify-center items-center mt-[50%]"><CircularProgress /></div>
                ) : (
                    <div className="overflow-y-auto max-h-80 mt-5">
                        {filteredFriends.slice(0, friendsDisplayCount).map((friend) => (
                            <div key={friend._id} className="friend flex items-center justify-between p-2 bg-gray-100 rounded-lg mb-2">
                                <p>{friend.name}</p>
                                <button
                                    className="bg-red-500 text-white rounded-md p-2"
                                    onClick={() => HandleReject(friend._id, myID)}
                                >
                                    Unfollow
                                </button>
                            </div>
                        ))}
                        {friendsDisplayCount < filteredFriends.length && (
                            <Button
                                onClick={() => setFriendsDisplayCount(friendsDisplayCount + 10)}
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="mt-4"
                            >
                                See More Friends
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Non-Friends Column */}
            <div className="lg:w-1/2 w-full">
                <h2 className="text-2xl font-semibold mb-4">Non-Friends</h2>
                <TextField
                    label="Search Non-Friends"
                    variant="outlined"
                    fullWidth
                    value={searchNonFriends}
                    onChange={(e) => setSearchNonFriends(e.target.value)}
                    className="mb-4"
                />
                {loading ? (
                    <div className="flex justify-center items-center mt-[50%]"><CircularProgress /></div>
                ) : (
                    <div className="overflow-y-auto max-h-80  mt-5">
                        {filteredNonFriends.slice(0, nonFriendsDisplayCount).map((nonFriend) => (
                            <div key={nonFriend._id} className="non-friend flex items-center justify-between p-2 bg-gray-100 rounded-lg mb-2">
                                <p>{nonFriend.name}</p>
                                <button
                                    className={`bg-blue-500 text-white rounded-md p-2`}
                                    onClick={(e) => {
                                        e.target.disabled = true;  // Disable only this button
                                        e.target.textContent = "Sending...";  // Update button text
                                        sendRequest(nonFriend._id, myID)
                                            .finally(() => {
                                                e.target.disabled = false;  // Re-enable button after request completes
                                                e.target.textContent = "Send Friend Request";  // Reset text
                                            });
                                    }}
                                >
                                   {nonFriend?.friends?.find((n) => n.friend.toString() === myID)?.status !== "rejected" ? 
                                    nonFriend?.friends?.find((n) => n.friend.toString() === myID)?.status || "Send Request" 
                                    : "Send Request"}

                                </button> 
                            </div>
                        ))}
                        {nonFriendsDisplayCount < filteredNonFriends.length && (
                            <Button
                                onClick={() => setNonFriendsDisplayCount(nonFriendsDisplayCount + 10)}
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="mt-4"
                            >
                                See More Non-Friends
                            </Button>
                        )}
                    </div>
                )}
            </div>

        </div>


   
     <Typography variant="h5" component="h2" sx={{ my: 4, color: '#1976D2', fontWeight: 'bold' }}>
        Friend Requests
    </Typography>
        <Grid container spacing={3}>
            {friendRequests?.filter((user)=> user.status !== "rejected")
            .map((user) => (
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
    

        </>
    );
}

export default Page;
