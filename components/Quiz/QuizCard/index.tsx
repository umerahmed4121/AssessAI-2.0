"use client"


import InputTextArea from '@/components/InputTextArea';
import { updateResponse } from '@/lib/actions/quiz.action';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { RiDeleteBin2Fill } from "react-icons/ri";

const QuestionCard = ({ type, index, question, answer, totalMarks, onMarksChange, onQuestionChange, onAnswerChange, onDelete, responseId }: {
    type: "CREATE" | "RESPONSE" | "REVIEW",
    index: number,
    question: string,
    answer: string,
    totalMarks: number,
    onMarksChange?: (value: number) => void,
    onQuestionChange?: (value: string) => void,
    onAnswerChange: (value: string) => void,
    onDelete?: (index: number) => void,

    responseId?: string,

}) => {

    const handleResponseUpdate = async (responseId: string, answer: string) => {
        if (type === "RESPONSE") {
            const res = await updateResponse(responseId, answer )
            if(res.type === "error"){
                console.log(res.message)
            }
        }
    }

    return (
        <div className='w-full bg-primary-light my-2 p-2 rounded-md border border-primary-light-2'>

            <p className='p-1 text-center text-xl'>Question {index+1}</p>

            <div className='grid grid-cols-[auto,auto] justify-between items-center'>

                <div className='p-2 flex flex-row justify-center items-center gap-2 h-fit'>

                    {type === "CREATE" && (
                        <div className='flex items-center gap-2'>
                            <p>Marks:</p>
                            <input
                                className='bg-primary-light w-20 p-1 border border-primary-light-2 rounded-md focus:outline-none text-white placeholder:italic text-center'
                                type="number"
                                value={totalMarks}
                                min={1}
                                onChange={(e) => onMarksChange && onMarksChange(parseInt(e.target.value))}
                            />
                        </div>
                    )}
                    {type === "RESPONSE" && (
                        <div className='p-1 '>
                            (Marks: {totalMarks})
                        </div>
                    )}
                </div>

                {type === "CREATE" && (
                    <div className="">
                        <button
                            className='bg-secondary p-2 m-1 rounded-md '
                            onClick={() => onDelete && onDelete(index)}
                        >
                            <RiDeleteBin2Fill />
                        </button>
                    </div>
                )}
            </div>

            <div className='p-2 rounded-md bg-primary'>

                {type === "CREATE" && (
                    <InputTextArea
                        name='question'
                        label='Question'
                        value={question}
                        onChange={(e) => onQuestionChange && onQuestionChange(e.target.value)}
                    />
                )}
                {(type === "RESPONSE" || type === "REVIEW") && (
                    <div>
                        {question}
                    </div>
                )}


                <InputTextArea
                    name='answer'
                    label='Answer'
                    value={answer}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    onBlur={(e) => responseId && handleResponseUpdate(responseId, answer)}
                />

            </div>



        </div>
    )
}



export default QuestionCard