'use client'

import React, { useEffect, useState } from 'react'
import Loader from '@/components/Loader'
import Image from 'next/image'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { assessWithGemini, getQuizResponsesByCreator, updateQuizGrading } from '@/lib/actions/quiz.action'
import ResponseCard from '@/components/ResponseCard'
import { toast } from 'react-toastify'
import { Toast } from '@/components/Toast'
import { useSession } from 'next-auth/react'


const ResponsesPage = ({ params } : { params: { quizId: string } }) => {

    const [loading, setLoading] = useState(false)
    // Getting user_id ----------------------------------------------------
    const { data: session, status } = useSession()
    const user = session?.user || null


    // ----------------------------------------------------------------------


    interface QuizResponsesProps {
      _id: string;
      title: string;
      description: string;
      assessments: {
        _id: string;
        question: string;
        answer: string;
        totalMarks: number;
        responses: {
          _id: string;
          answer: string;
          obtainedMarks: number;
          aiRemarks: string;
        }[];
      }[];
    }

    const [quiz, setQuiz] = useState<QuizResponsesProps>({
      _id: '',
      title: '',
      description: '',
      assessments: [],
    })

    const [selected, setSelected] = useState('')

    useEffect(() => {

        const fetchQuiz = async () => {
            if (user) {
                try {
                    const res = await getQuizResponsesByCreator(user._id, params.quizId)
                    console.log("Fetched responses",res.data)
                    setQuiz(res.data)
                    setLoading(false)
                }
                catch (error: any) {
                    console.log(error.message)
                } 
            }
        }
        fetchQuiz()
    }
        , [session])
    

    const handleAssessWithGemini = async () => {
        
        if(selected !== '') {
            setLoading(true)
            const resp  = await assessWithGemini(selected)
            const quizResponse = resp.data
            if(resp.type === 'success') {
                quiz.assessments.map((assessment, index) => {
                    assessment.responses.map((response, index) => {
                        if(response._id === quizResponse._id) {
                            response.aiRemarks = quizResponse.aiRemarks
                        }
                        return response;
                    })
                    return assessment;
                })
            } else {
                toast.error(resp.message)
            }
            setLoading(false)
            setShowParticipants(false)
        }
    }

    const [showParticipants, setShowParticipants] = useState(false);
    const toggleShowParticipants = () => {
        setShowParticipants(!showParticipants);
    }

    const handleUpdateAssessment = (assessmentId : string, responseId: string, marks:number) => {
        const updatedAssessments = quiz.assessments.map((assessment, index) => {
            if (assessment._id === assessmentId) {
                assessment.responses.map((response, index) => {
                    if (response._id === responseId) {
                        response.obtainedMarks = marks;
                    }
                    return response;
                })
            }
            return assessment;
        })
        setQuiz({ ...quiz, assessments: updatedAssessments });
    }

    const handleUpdateQuiz = async () => {
        
        console.log(quiz)
        setLoading(true)
        const resp = await updateQuizGrading(quiz)
        if(resp.type === 'success') {
            toast.success(resp.message)
        } else {
            toast.error(resp.message)
        }
        setLoading(false)
        setShowParticipants(false)
    }

    return (
        <>
            <Loader visible={loading} dashboard={true} />
            <Toast />
            {quiz && (
                <div className='grid grid-cols-1 xl:grid-cols-[70%,28%] gap-[2%]  w-full'>

                    <div className="fixed top-[70px] left-2 sm:left-[calc(30%+10px)] lg:left-[calc(20%+10px)] flex gap-4">
                        <button
                            className=' w-10 h-10 sm:w-14 sm:h-14  rounded-md flex xl:hidden justify-center items-center transition duration-500 delay-200 hover:scale-105 '
                            onClick={() => toggleShowParticipants()}
                        >
                            <BsThreeDotsVertical className='text-white text-3xl' />

                        </button>
                    </div>

                    <div className={`fixed border border-primary-light-2 bg-primary-light ${showParticipants ? " w-[70%] sm:w-[40%] md:w-[35%] lg:w-[20%]" : " w-0 opacity-0"} h-screen right-0 top-[60px] transition-all duration-500`}
                    onMouseLeave={() => setShowParticipants(false)}
                    
                    >
                        <div className='bg-primary-light flex flex-col  rounded-md h-[calc(100vh-113px)] p-4'>

                            <div className="w-full grid grid-cols-1 gap-2 h-full content-between">
                                <div className="w-full">
                                    <button className='border border-primary-light-2 rounded-md p-2 flex items-center justify-center w-full'
                                        onClick={() => handleAssessWithGemini()}
                                    >
                                        <Image 
                                        src="/assets/icons/gemini.png"
                                        alt='gemini'
                                        width={50}
                                        height={50}
                                        />
                                         &nbsp; Assess with Gemini
                                    </button>
                                    <div className='flex flex-row justify-center items-center gap-2 w-full py-6 px-1'>
                                        <div className='w-full h-[1px] rounded-full bg-primary-light-2'></div>
                                        <span className='text-sm'>OR</span>
                                        <div className='w-full h-[1px] rounded-full bg-primary-light-2'></div>
                                    </div>
                                    <button className='border border-primary-light-2 rounded-md p-2 flex items-center justify-center w-full'>
                                        {/* <Image src={"/assets/icons/gpt.png"} alt='gpt' width={50} height={50}/> &nbsp; Assess with GPT-4 */}
                                        <Image
                                        src="/assets/logo.png"
                                        alt='logo'
                                        width={50}
                                        height={50}

                                        /> &nbsp; Assess with Assess AI
                                    </button>
                                </div>
                                <div className="w-full">
                                    <button className='bg-secondary rounded-md p-2 flex items-center justify-center w-full'
                                        onClick={() => handleUpdateQuiz()}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex flex-col'>
                        <div className='bg-primary m-1 p-1 focus:border-b-2 border-primary-light focus:outline-none w-full text-3xl text-center '>
                            {quiz?.title?.length > 20 ? quiz?.title?.substring(0, 20) + "..." : quiz?.title}
                        </div>
                        <div className='bg-primary m-1 p-1 focus:border-b-2 border-primary-light focus:outline-none w-full text-2xl text-center text-white italic'>
                            {quiz?.description?.length > 20 ? quiz?.description?.substring(0, 20) + "..." : quiz?.description}
                        </div>
                        {quiz?.assessments?.map((assessment, index) => (
                            
                            <>
                            <ResponseCard 
                            assessment={assessment} 
                            selected={selected}
                            setSelected={setSelected}
                            key={index} 
                            handleUpdateAssessment={(assessmentId, responseId, marks) => {handleUpdateAssessment(assessmentId, responseId, marks)}} />
                            </>
                        ))}


                    </div>
                    <div className=' fixed right-[20px] bg-primary-light hidden xl:flex xl:flex-col  border border-primary-light-2 rounded-md h-[calc(100vh-113px)] p-4'>

                        <div className="w-full grid grid-cols-1 gap-2 h-full content-between">
                            <div className="w-full">
                                <button className='border border-primary-light-2 rounded-md p-2 flex items-center justify-center w-full'
                                    onClick={() => handleAssessWithGemini()}
                                >
                                    <Image 
                                        src="/assets/icons/gemini.png"
                                        alt='gemini'
                                        width={50}
                                        height={50}
                                        /> &nbsp; Assess with Gemini
                                </button>
                                <div className='flex flex-row justify-center items-center gap-2 w-full py-6 px-1'>
                                    <div className='w-full h-[1px] rounded-full bg-primary-light-2'></div>
                                    <span className='text-sm'>OR</span>
                                    <div className='w-full h-[1px] rounded-full bg-primary-light-2'></div>
                                </div>
                                <button className='border border-primary-light-2 rounded-md p-2 flex items-center justify-center w-full'>
                                    {/* <Image src={"/assets/icons/gpt.png"} alt='gpt' width={50} height={50}/> &nbsp; Assess with GPT-4 */}
                                    <Image
                                        src="/assets/logo.png"
                                        alt='logo'
                                        width={50}
                                        height={50}
                                        /> &nbsp; Assess with Assess AI
                                </button>
                            </div>
                            <div className="w-full">
                                <button className='bg-secondary rounded-md p-2 flex items-center justify-center w-full'
                                    onClick={() => handleUpdateQuiz()}
                                >
                                    Save
                                </button>
                            </div>
                        </div>




                    </div>

                </div>
            )}



        </>
    )
}

export default ResponsesPage
