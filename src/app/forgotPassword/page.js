// import React from 'react'

// function page() {
//     function HandleSubmit (){

//     }

//   return (
//     <div>
//         <form onSubmit={HandleSubmit}>
            
//         </form>
//     </div>
//   )
// }

// export default page









'use client'

import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, Button, Box, Card, CardContent, Input } from '@mui/material';
import { toast } from 'react-toastify';

function CreateQuizPage() {
    const [email, setQuizName] = useState('');


// Handle quiz creation
  const handleSubmit = async () => {
    const response = await fetch('/api/forgotPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    });
  
    if (response.ok) {     
      const data = await response.json();
      setQuizzes([...quizzes, data.quiz]);
      setQuizName('');
      // alert('Quiz created successfully!');
      toast.success("Quiz Created Successfully");
    } else {
      toast.warning('Give Name to Quiz');
    }
  };
  

    return (
        <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Box>
            <Card sx={{ width: { xs: 300, sm: 500 },  // 300px width below 'sm' and 500px width above 'sm'
                height: { xs: '80%', sm: 'auto' },  // 80% height below 'sm' and auto above 'sm'
                boxShadow: 5,
                borderRadius: 4,
                padding: '32px' }}>
                <CardContent>
                 <Box mt={4} display="flex" flexDirection="column" gap={3}>
                    <Typography variant="h4" component="div" align="center" sx={{ fontWeight: 'bold', color: '#1976D2' }}>
                        Name Your Quiz
                    </Typography>
                <Input
                    type="text"
                    value={email}
                    onChange={(e) => setQuizName(e.target.value)}
                    placeholder="Quiz Name"
                    className="block text-gray-700 w-full px-4 py-2 mb-4 border rounded"
                />
            
                    <Button onClick={handleSubmit}
                            variant="contained"
                            color="primary"
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
                                 Send Email
                        </Button>
                       
                    </Box>
                </CardContent>
            </Card>
            </Box>
        </Container>
    );
    
}

export default CreateQuizPage;
