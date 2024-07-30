import QuizForm from '@/components/QuizForm'
import React from 'react'

const QuizEditPage = ({ params }: { params: { quizId: string } }) => {
  return (
    <QuizForm
    type='EDIT'
    quizId={params.quizId}
    />
  )
}

export default QuizEditPage