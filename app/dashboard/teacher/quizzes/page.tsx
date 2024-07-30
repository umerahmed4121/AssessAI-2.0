"use client"

import Loader from '@/components/Loader'
import Modal from '@/components/Modal'
import Spinner from '@/components/Spinner'
import ToggleButton from '@/components/ToggleButton'
import { deleteQuiz, getQuizByCreator, toggleQuizResponse } from '@/lib/actions/quiz.action'
import { getGroupByCreator } from '@/lib/actions/user.action'
import { IQuiz } from '@/models/quiz/quiz.model'
import { mongoDateToString } from '@/utils/date'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { FaPlus, FaRegEdit } from 'react-icons/fa'
import { IoMdOpen } from 'react-icons/io'
import { MdDelete } from 'react-icons/md'



const Page = () => {

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<IQuiz | null>(null)

  const tableHeaderStyle = 'bg-primary-light p-2'

  const { data: session, status } = useSession()
  const user = session?.user as SessionUser


  const [quizzes, setQuizzes] = useState<[] | IQuiz[]>([])

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await getQuizByCreator(user._id)
        
        if(res.type === "success"){
          console.log(res.data)
          setQuizzes(res.data)
        }else{
          console.log(res.message)
        }
        
      } catch (error: any) {
        console.log(error.message)
      }
    }
    fetchQuizzes()
  }, [session])
  

  const handleResponseToggle = async (quiz: IQuiz) => {
    
    const res = await toggleQuizResponse(quiz._id)
    if(res.type === "success"){
      setQuizzes(prevQuizzes => {
        return prevQuizzes.map(q => {
          if(q._id === quiz._id){
            return {...q, isAcceptingResponses: !q.isAcceptingResponses}
          }
          return q
        })
      })
    } else {
      console.log(res.message)
    }

    
  }

  const handleDeleteQuiz = async () => {
    if(quizToDelete){
      const res = await deleteQuiz(quizToDelete._id)
      if(res.type === "success"){
        setQuizzes(prevQuizzes => {
          return prevQuizzes.filter(q => q._id !== quizToDelete._id)
        })
        setShowDeleteModal(false)
      } else {
        console.log(res.message)
      }
    }
  }

  return (
    <div className='w-full'>
      <Loader visible={loading} dashboard={true} />
      {showDeleteModal && 
      <Modal 
      title='Delete Quiz' 
      description={`Are you sure you want to delete "${quizToDelete?.title}" quiz?`}
      isOpen={showDeleteModal} 
      onClose={() => setShowDeleteModal(false)} 
      onConfirm={handleDeleteQuiz}
      type='DELETE'
      />}
      <h1 className='w-full text-3xl pt-2 pb-10 text-center'>Quizzes</h1>

      <div className='w-full overflow-auto'>
        <div className='w-full grid items-center grid-cols-6 p-2 min-w-[650px] border border-primary-light rounded-md  '>


          <div className={tableHeaderStyle}>Title</div>
          <div className={tableHeaderStyle}>Description</div>
          <div className={tableHeaderStyle}>Responses</div>
          <div className={tableHeaderStyle}>Created at</div>
          <div className={tableHeaderStyle}>Responses</div>
          <div className={tableHeaderStyle}>Actions</div>


          {status === 'loading' ?
            <Spinner visible={true} className={"col-span-6"} /> :

            quizzes?.map((quiz) => (
              <>
                <div className='p-2 flex items-center'>{quiz.title.length > 20 ? quiz.title.substring(0, 20) + "..." : quiz.title}</div>
                <div className='p-2 flex items-center'>{quiz.description.length > 20 ? quiz.description.substring(0, 20) + "..." : quiz.description}</div>
                <div className='p-2 cursor-pointer flex items-center gap-2'

                  onClick={() => {
                    router.push(`quizzes/responses/${quiz._id}`)
                  }}
                >{0} <IoMdOpen /> </div>
                <div className='p-2 flex items-center '>{mongoDateToString(quiz.createdAt)}</div>
                <div className='p-2 flex items-center'>
                  <ToggleButton
                    enable={quiz.isAcceptingResponses}
                    onChange={() => { handleResponseToggle(quiz) }}
                    className={"w-8 h-4"}
                    circleClassName={"w-2 h-2"}
                  />
                </div>
                <div className='p-2 flex items-center gap-2'>
                  <Link href={`quizzes/edit/${quiz._id}`} target='_blank' className=' w-8 h-8 rounded-full flex justify-center items-center transition duration-500 delay-200 hover:scale-125 '>
                    <FaRegEdit className='text-blue-700 text-2xl' />
                  </Link>
                  <button
                  onClick={() => {
                    setQuizToDelete(quiz)
                    setShowDeleteModal(true)
                  }}
                  className=' w-8 h-8 rounded-full flex justify-center items-center transition duration-500 delay-200 hover:scale-125 '>
                    <MdDelete  className='text-red-700 text-2xl' />
                  </button>
                </div>
              </>


            )
            )
          }

        </div>
      </div>


      <Link href={`quizzes/create`} onClick={() => setLoading(true)} className='bg-secondary w-10 h-10 sm:w-14 sm:h-14 fixed bottom-10 right-10 rounded-full flex justify-center items-center transition duration-500 delay-200 hover:scale-125 '>
        <FaPlus className='text-white text-3xl' />

      </Link>

    </div>
  )

}

export default Page