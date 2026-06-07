'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';

const AttemptQuizPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchQuiz = async () => {
        try {
          const response = await fetch(`/api/quiz/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch quiz');
          }
          const data = await response.json();
          setQuiz(data);
          setQuestions(data.questions);
        } catch (error) {
          console.error('Error fetching quiz:', error);
        }
      };

      fetchQuiz();
    }
  }, [id]);


  const handleAnswerChange = (questionId, answer) => {
    if (answer === 'true') {
      setAnswers({ ...answers, [questionId]: 1 });
    } else if (answer === 'false') {
      setAnswers({ ...answers, [questionId]: 0 });
    } else {
      setAnswers({ ...answers, [questionId]: answer });
    }
  };

  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    let correctAnswersCount = 0;

    try {
      const validationPromises = questions.map(async (question) => {
        const userAnswer = answers[question._id];

        console.log("question.questionText:", question.questionText , "question.correctAnswer:", question.correctAnswer)

        if (question.type === 'MCQs') {
          return parseInt(userAnswer) === question.correctOption;
        } 
        
        if (question.type === 'True/False Questions') {
          return userAnswer === question.correctOption;
        }

        if (question.type === 'Fill in the Blanks') {
          if (!userAnswer) return false;
          
          // Call the AI validation API
          const response = await fetch('/api/validate-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              questionText: question.questionText,
              correctAnswer: question.correctAnswer,
              userAnswer: userAnswer
            })
          });
          const result = await response.json();
          return result.isCorrect;
        }

        return false;
      });

      const results = await Promise.all(validationPromises);
      correctAnswersCount = results.filter(Boolean).length;

      const percentageScore = (correctAnswersCount / questions.length) * 100;
      setScore(percentageScore);
      setShowResult(true);

      const notificationId = localStorage.getItem("notificationId");
      if (notificationId) {
        await fetch(`/api/notifications/${notificationId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: notificationId, status: 'completed', quizScore: percentageScore }),
        });
      }

      // Redirect to notifications page after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/notifications');
      }, 2000);

    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  if (showResult) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Quiz Completed!</h1>
          <p className="text-5xl font-bold text-blue-600 mb-2">{score.toFixed(0)}%</p>
          <p className="text-gray-600 mb-6">Great job! Your score has been recorded.</p>
          <p className="text-sm text-gray-500">Redirecting to notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
     
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">{quiz.name}</h1>
        <Tabs value={`question${currentQuestionIndex + 1}`} onValueChange={(value) => setCurrentQuestionIndex(parseInt(value.replace('question', '')) - 1)}>
          <TabsList className="flex mb-6 justify-center">
            {quiz.questions.map((_, index) => (
              <TabsTrigger key={index} value={`question${index + 1}`} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mx-1">
                {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          {quiz.questions.map((question, index) => (
            <TabsContent key={index} value={`question${index + 1}`} className="p-4 flex justify-center items-center ">
                  <div className='rounded-xl w-full  border border-gray-300 p-4 '>
              <div className="mb-4">
                <p className="text-xl font-medium mb-4 text-gray-800 ">{`Q${index + 1 }- ${question.questionText}`}</p>
                {question.type === 'MCQs' &&
                  question.options.map((option, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={`${question._id}-${index}`}
                        name={question._id}
                        value={index}
                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                        className="mr-2 text-gray-800"
                      />
                      <label htmlFor={`${question._id}-${index}`} className="text-gray-700">{option}</label>
                    </div>
                  ))}
                {question.type === 'True/False Questions' && (
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={`${question._id}-true`}
                      name={question._id}
                      value="true"
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      className="mr-2 text-gray-800"
                    />
                    <label htmlFor={`${question._id}-true`} className="mr-4 text-gray-700">True</label>
                    <input
                      type="radio"
                      id={`${question._id}-false`}
                      name={question._id}
                      value="false"
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      className="mr-2 text-gray-700"
                    />
                    <label htmlFor={`${question._id}-false`} className="text-gray-700">False</label>
                  </div>
                )}
                {question.type === 'Fill in the Blanks' && (
                  <input
                    type="text"
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    className="block w-full px-4 py-2 mb-4 border rounded text-gray-800 outline-none"
                    placeholder="Your answer"
                    
                  />
                )}
                
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-800 "
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-800"
            disabled={currentQuestionIndex === quiz.questions.length - 1}
          >
            Next
          </button>
        </div>
        <div className="flex justify-center mt-6">
          {quiz.questions.length > 0 && (
            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className={`px-4 py-2 text-white rounded ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttemptQuizPage;






