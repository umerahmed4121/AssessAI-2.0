"use client"

import Loader from "@/components/Loader";
import QuestionCard from "@/components/Quiz/QuizCard";
import { getQuizForResponse, submitResponse } from "@/lib/actions/quiz.action";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify";

interface QuizResponseProps {
    participantId: string;
    quizId: string;
    title: string;
    description: string;
    assessments: {
        responseId: string;
        totalMarks: number;
        question: string;
        answer: string;
    }[];
}

export default function QuizResponse({ params }: { params: { token: string } }) {

    // Authorization
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const { data: session, status } = useSession()
    const user = session?.user || null

    const [response, setResponse] = useState< QuizResponseProps>(
        {
            participantId: "",
            quizId: "",
            title: "",
            description: "",
            assessments: []
        }
    )
    const [isAlreadyResponded, setIsAlreadyResponded] = useState(false)

    const handleAnswerChange = (index: number, value:string) => {
        const updatedResponse = { ...response }
        updatedResponse.assessments[index].answer = value
        setResponse(updatedResponse)
    };



    useEffect(() => {

        const fetchQuizForResponse = async () => {
            try {
                
                const res = await getQuizForResponse(params.token)

                if (res.type === "success") {
                    console.log("Fetched for response",res.data)
                    setResponse(res.data)
                } else {
                    console.log(res.message)
                }

            } catch (error: any) {
                console.log(`
                    Error in fetching: ${error.message}`)
            }
        }

        fetchQuizForResponse()
        
    }, [session])

    
    const containerRef = useRef(null)

    const [contentHeight, setContentHeight] = useState(0)
    const [screenHeight, setScreenHeight] = useState(0)
    const [smallContent, setSmallContent] = useState(false)
    const [warning, setWarning] = useState(false)

    useEffect(() => {

        const container = containerRef?.current as unknown as HTMLElement
        setContentHeight(container.clientHeight)

        const screenHeight = window.innerHeight;
        setScreenHeight(screenHeight)

        if (contentHeight < screenHeight) {
            setSmallContent(true)
        } else {
            setSmallContent(false)
        }

        container.addEventListener('mouseleave', () => {
            setWarning(true)

        })
        container.addEventListener('mouseenter', () => {
            setSeconds(9)
            setWarning(false)
        })
    }, [loading, contentHeight, screenHeight])

    // --------------------------

    const [seconds, setSeconds] = useState(9); // Start from 5 seconds
    const intervalRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (warning) {
            intervalRef.current = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1);
            }, 1000);
        }

        // Cleanup function
        return () => clearInterval(intervalRef.current);
    }, [warning]);

    useEffect(() => {
        if (seconds <= 0) {
            clearInterval(intervalRef.current);
            // setLoading(true)
            // router.replace("/dashboard/student/quizzes")
        }
    }, [seconds]);
    // -----------------------

    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
        if (!isFullScreen) {
            // Enable fullscreen
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
        } else {
            // Disable fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }

        setIsFullScreen(!isFullScreen);
    };

    // -------------------------------------------------
    const [currentTime, setCurrentTime] = useState<string | null>(null);

    useEffect(() => {
      // Update the current time every second
      const interval = setInterval(() => {
        setCurrentTime(new Date().toLocaleTimeString());
      }, 1000);
  
      // Cleanup function to clear the interval when the component unmounts
      return () => clearInterval(interval);
    }, []);
  
    // If currentTime is null, display a placeholder or loading message
    const displayTime = currentTime || 'Loading...';
  
    // -----------------------------------------------------






    

    // Quiz response
    const handleResponseSubmit = async () => {
        setLoading(true)
        console.log(response)
        const resp = await submitResponse(response)
        if (resp.type === "success") {
            toast.success("Response submitted successfully")
        } else {
            toast.error("Failed to submit response")
        }
        router.push('/dashboard/student/quizzes')
    }



    return (
        <div ref={containerRef} className={`w-full grid  ${smallContent ? "h-screen" : ""}`}>

            <Loader visible={loading} />
            {(warning && !isAlreadyResponded) && (
                <div className='fixed top-0 left-0 w-full h-screen bg-[#ffffff80] my_blur flex justify-center items-center z-10 '>
                    <div className='text-red-700 font-bold text-3xl sm:text-5xl p-2 flex flex-col gap-2 text-center'>

                        <div className='text-5xl sm:text-8xl p-8'>
                            Returning in 00:0{seconds}
                        </div>
                        <div>
                            DON&apos;T GO ANYWHERE!
                        </div>
                        <div className='font-normal'>
                            Your activity is being monitored
                        </div>


                    </div>
                </div>
            )}
            {(
                <div className='w-full'>

                    {/* Header */}
                    <div className='fixed top-0 left-0 h-16 sm:h-32 w-full flex flex-row gap-2 justify-between items-center py-4 px-8 sm:px-16 bg-primary-light border-b border-primary-light-2'>

                        <time className='text-lg sm:text-xl p-1 font-sans'>

                            {displayTime}

                        </time>

                        {response !== null && (
                            <div>
                                <div className='m-1 p-1 focus:border-b-2 border-primary-light focus:outline-none w-full text-lg sm:text-3xl text-center '>

                                    {response.title.length > 20 ? response.title.substring(0, 20) + "..." : response.title}

                                </div>
                                <div className='hidden sm:flex  m-1 p-1 focus:border-b-2 border-primary-light focus:outline-none w-full sm:text-2xl text-center text-white italic' >
                                    {response.description.length > 30 ? response.description.substring(0, 30) + "..." : response.description}
                                </div>

                            </div>
                        )}




                        <div className='hidden sm:flex rounded-md bg-primary-light border border-primary-light-2 p-2 hover:'>
                            <button onClick={toggleFullScreen}>
                                {isFullScreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
                            </button>

                        </div>

                    </div>

                    <div className='grid p-4 pt-20 sm:pt-36 w-full sm:w-1/2 m-auto justify-items-center'>

                        {isAlreadyResponded ? (
                            <div className='grid gap-8 justify-center justify-items-center p-4 rounded-md text-3xl sm:text-3xl  text-center bg-primary-light border border-primary-light-2'>
                                <div>
                                    You have already already submitted a response
                                </div>
                                <button onClick={() => {
                                    setLoading(true)
                                    router.replace("/dashboard/student")
                                }} className='bg-secondary w-fit px-4 py-2 rounded-md'>
                                    Back to dashboard
                                </button>
                            </div>
                        ) : (
                            <>
                                {response !== null && (
                                    <>
                                        {response.assessments.map((assessment, index) => (
                                            <QuestionCard
                                                type="RESPONSE"
                                                responseId={assessment.responseId}
                                                key={index}
                                                index={index}
                                                totalMarks={assessment.totalMarks}
                                                question={assessment.question}
                                                answer={assessment.answer}
                                                onAnswerChange={(value) => handleAnswerChange(index, value)}
                                            />
                                        ))}
                                        <button
                                            className='bg-secondary p-2 my-8 rounded-md w-1/4 self-center '
                                            onClick={handleResponseSubmit}
                                        >
                                            Submit
                                        </button>

                                    </>
                                )}

                            </>
                        )}



                    </div>

                </div>
            )}
        </div>

    )
}

