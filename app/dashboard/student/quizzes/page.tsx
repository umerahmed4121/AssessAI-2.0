"use client"

import React, { useState, useEffect } from 'react'
import { FaPlus } from "react-icons/fa6";
import { IoOpenOutline } from "react-icons/io5";
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { } from 'next/navigation'

import { useSession } from 'next-auth/react';
import Spinner from '@/components/Spinner';
import Loader from '@/components/Loader';
import { mongoDateToString } from '@/utils/date';
import { getQuizByParticipant, initializeResponse } from '@/lib/actions/quiz.action';
import { IQuiz } from '@/models/quiz/quiz.model';


const Quizzes = () => {

    const router = useRouter()

    // Getting user_id ----------------------------------------------------
    const { data: session, status } = useSession()
    const user = session?.user as SessionUser


    const [loading, setLoading] = useState(false)
    const tableHeaderStyle = 'bg-primary-light p-2'

    const [quizzes, setQuizzes] = useState<[] | IQuiz[]>([])

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await getQuizByParticipant(user._id)

                if (res.type === "success") {
                    console.log(res.data)
                    setQuizzes(res.data)
                } else {
                    console.log(res.message)
                }

            } catch (error: any) {
                console.log(error.message)
            }
        }
        fetchQuizzes()
    }, [session])


    const handleCreateResponse = async (quizId: any, userId: any) => {

        const res = await initializeResponse(quizId, userId)
        if (res.type === "success") {
            console.log(res.data)
            router.push(`/quiz/${res.data}`)
        } else {
            console.log(res.message)
        }
    }


    return (
        <div className='w-full'>
            <Loader visible={loading} dashboard={true} />
            <h1 className='w-full text-3xl pt-2 pb-10 text-center'>Quizzes</h1>

            <div className='w-full overflow-auto'>
                <div className='w-full grid items-center grid-cols-5 p-2 min-w-[650px] border border-primary-light rounded-md  '>


                    <div className={tableHeaderStyle}>Title</div>
                    <div className={tableHeaderStyle}>Description</div>
                    <div className={tableHeaderStyle}>Created at</div>
                    <div className={tableHeaderStyle}>Responses</div>
                    <div className={tableHeaderStyle}>Action</div>


                    {status === 'loading' ?
                        <Spinner visible={true} className={"col-span-5"} /> :

                        quizzes?.map((quiz) => (
                            <>
                                <div className='p-2'>{quiz.title.length > 20 ? quiz.title.substring(0, 20) + "..." : quiz.title}</div>
                                <div className='p-2'>{quiz.description.length > 20 ? quiz.description.substring(0, 20) + "..." : quiz.description}</div>
                                <div className='p-2'>{mongoDateToString(quiz.createdAt)}</div>
                                <div className='p-2'>{quiz.isAcceptingResponses ? "Accepting" : "Closed"}</div>
                                {quiz.isAcceptingResponses && (
                                    <button
                                        className='px-4 py-2  bg-secondary m-1 w-fit h-fit rounded-md'
                                        onClick={() => {
                                            handleCreateResponse(quiz._id, user._id)
                                        }}
                                    >Start Quiz</button>
                                )
                                }
                            </>


                        )
                        )
                    }

                </div>
            </div>


        </div>
    )
}

export default Quizzes