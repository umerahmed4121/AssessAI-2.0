"use client"


import Loader from '@/components/Loader'
import QuestionCard from '@/components/Quiz/QuizCard'
import Spinner from '@/components/Spinner'
import ToggleButton from '@/components/ToggleButton'
import { createQuiz, getQuizById, updateQuiz } from '@/lib/actions/quiz.action'
import { searchInGroupsAndUser, searchStudents } from '@/lib/actions/user.action'
import { IGroup } from '@/models/group/group.model'
import { IAssessment } from '@/models/quiz/assessment.model'
import { IQuiz } from '@/models/quiz/quiz.model'
import { IUser } from '@/models/user/user.model'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { CiCircleRemove } from 'react-icons/ci'
import { FaSearch } from 'react-icons/fa'
import { IoCheckmarkCircle, IoPersonAddOutline } from 'react-icons/io5'
import { MdSend } from 'react-icons/md'
import { RiSave3Line } from 'react-icons/ri'
import { toast, ToastContainer } from 'react-toastify'
import { useDebouncedCallback } from 'use-debounce'

interface QuizProps {
    _id?: string,
  author: IUser,
  title: string,
  description: string,
  assessments: {
    totalMarks: number,
    question: string,
    answer: string
  }[],
  participants: {
    groups: {
      _id: string,
      type?: string,
      name: string,
      description?: string,
    }[],
    individuals: {
      _id: string,
      type?: string,
      name: string,
      email: string,
      picture?: string,
    }[]
  },
  isAcceptingResponses: boolean
}

type assessmentFormProps = {
    type: "CREATE" | "EDIT"
    quizId?: string
}

const QuizForm = ({
    type,
    quizId
}: assessmentFormProps) => {


  const router = useRouter()

  const { data: session, status } = useSession()
  const user = session?.user as SessionUser

  const [loading, setLoading] = useState(false)

  const [showParticipants, setShowParticipants] = useState(false)

  const [assessments, setAssessments] = useState<{ totalMarks: number, question: string, answer: string }[]>([{ totalMarks: 5, question: '', answer: '' }])


  const [quiz, setQuiz] = useState<QuizProps>({
    _id: quizId,
    author: user,
    title: 'Quiz title',
    description: 'Quiz description',
    assessments: assessments,
    participants: {
      groups: [],
      individuals: []
    },
    isAcceptingResponses: false
  })

  useEffect(() => {
    if (user?._id) {
      setQuiz({ ...quiz, author: user })

    }
  }, [session])

  
  const handleAddQuestion = () => {
    setQuiz({ ...quiz, assessments: [...quiz.assessments, { totalMarks: 5, question: '', answer: '' }] })
  };

  const handleQuestionChange = (index: number, key: 'totalMarks' | 'question' | 'answer', value: string | number) => {
    const updatedAssessments: any[] = [...quiz.assessments];
    updatedAssessments[index][key] = value;
    setQuiz({ ...quiz, assessments: updatedAssessments });
  };
  

  const handleDeleteQuestion = (index: number) => {
    const updatedAssessments = [...quiz.assessments];
    updatedAssessments.splice(index, 1);
    setQuiz({ ...quiz, assessments: updatedAssessments });
  };




  const handleQuizCreation = async () => {
    console.log(quiz);
    const res =  await createQuiz(quiz)
    if(res.type === "success") {
      toast.success(res.message)
      router.push('/dashboard/teacher/quizzes')
    }
    else {
      toast.error(res.message)
    }

  }

  const handleQuizEdit = async () => {
    console.log(quiz);
    const res =  await updateQuiz(quiz)
    if(res.type === "success") {
      toast.success(res.message)
    }
    else {
      toast.error(res.message)
    }

  }

  const toggleShowParticipants = () => {
    setShowParticipants(!showParticipants);
  }



  if (type === "EDIT" && quizId) {
    useEffect(() => {
        const fetchData = async () => {
            const res = await getQuizById(quizId)
            console.log(res.data);
            if(res.type === "success") {
                const quiz = res.data as IQuiz

                setQuiz(quiz)
            }
        }
        fetchData()
    }, [])
  }



  return (
    <>
    <ToastContainer />
    
    <div className='grid grid-cols-1 2xl:grid-cols-[60%,38%] 2xl:gap-[2%] justify-center 2xl:justify-normal  w-full md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-full'>
      
      <Loader visible={loading} dashboard={true} />

      <div className={`fixed border border-primary-light-2 bg-primary-light ${showParticipants ? "w-[100%] sm:w-[70%]" : "hidden w-0 opacity-0"} h-screen right-0 top-[60px] transition-all duration-500`}>
        <div className='w-full bg-primary-light py-4 flex flex-col justify-center rounded-md h-[calc(100vh-113px)]'>
          <div className='flex flex-row justify-between gap-2 w-full py-1 px-4'>
            <h1 className='text-center text-xl py-2'>Participants</h1>
            <div className='flex flex-row justify-center items-center gap-2'>
              <div >
                Responses
              </div>

              <ToggleButton
                enable={quiz.isAcceptingResponses}
                onChange={() => setQuiz({ ...quiz, isAcceptingResponses: !quiz.isAcceptingResponses })}
                className={"w-16 h-8"}
                circleClassName={"w-6 h-6"}
              />



            </div>

          </div>


          {/* Participants */}

          <Participants
            quiz={quiz}
            setQuiz={setQuiz}
          />

        </div>
      </div>


      <div className='w-full  flex flex-col '>
        <div className="fixed bottom-[5%] right-[5%] flex gap-4">
          <button
            className='bg-secondary w-10 h-10 sm:w-14 sm:h-14  rounded-md flex 2xl:hidden justify-center items-center transition duration-500 delay-200 hover:scale-105 '
            onClick={() => toggleShowParticipants()}
          >
            <BsThreeDotsVertical className='text-white text-3xl' />

          </button>
         {type === "CREATE" && (
           <button
           className='bg-secondary w-10 h-10 sm:w-14 sm:h-14  rounded-full flex justify-center items-center transition duration-500 delay-200 hover:scale-105 '
           onClick={() => handleQuizCreation()}
         >
           <MdSend className='text-white text-3xl' />

         </button>)}
         {type === "EDIT" && (
          <button
          className='bg-secondary w-10 h-10 sm:w-14 sm:h-14  rounded-full flex justify-center items-center transition duration-500 delay-200 hover:scale-105 '
          onClick={() => handleQuizEdit()}
        >
          <RiSave3Line  className='text-white text-3xl' />

        </button>
         )}
        </div>

        <input
          type="text"
          className='bg-primary m-1 p-1 focus:border-b-2 border-primary-light focus:outline-none w-full text-3xl text-center '
          value={quiz.title}
          onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
        />
        <input
          type="text"
          className='bg-primary m-1 p-1 focus:border-b-2 border-primary-light focus:outline-none w-full text-2xl text-center text-white italic'
          value={quiz.description}
          onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
        />

        {quiz.assessments.map((assessment, index) => (
          <QuestionCard
            type='CREATE'
            key={index}
            index={index}
            totalMarks={assessment.totalMarks}
            question={assessment.question}
            answer={assessment.answer}
            onMarksChange={(value) => handleQuestionChange(index, 'totalMarks', value)}
            onQuestionChange={(value) => handleQuestionChange(index, 'question', value)}
            onAnswerChange={(value) => handleQuestionChange(index, 'answer', value)}
            onDelete={handleDeleteQuestion}
          />
        ))}
        <button
          className='bg-secondary p-2 m-1 rounded-md w-1/4 self-center '
          onClick={handleAddQuestion}
        >
          Add Question
        </button>

      </div>
      <div className='w-full bg-primary-light hidden 2xl:py-4 2xl:flex 2xl:flex-col justify-center border border-primary-light-2 rounded-md h-[calc(100vh-63px)]'>
        <div className='flex flex-row justify-between gap-2 w-full py-1 px-4'>
          <h1 className='text-center text-xl py-2'>Participants</h1>
          <div className='flex flex-row justify-center items-center gap-2'>
            <div >
              Responses
            </div>

            <ToggleButton
              enable={quiz.isAcceptingResponses}
              onChange={() => setQuiz({ ...quiz, isAcceptingResponses: !quiz.isAcceptingResponses })}
              className={"w-16 h-8"}
              circleClassName={"w-6 h-6"}
            />



          </div>

        </div>


        {/* Participants */}

         
        <Participants
          quiz={quiz}
          setQuiz={setQuiz}
        />

      </div>
    </div>
    </>
  )
}

export default QuizForm



const Participants = (
  { quiz, setQuiz }:
    {
      quiz: QuizProps,
      setQuiz: React.Dispatch<React.SetStateAction<QuizProps>>
    }

) => {

  const [search, setSearch] = useState('')
  const [participants, setParticipants] = useState<any[]>([])

  const findParticipants = useDebouncedCallback(async (value: string) => {
    const res = await searchInGroupsAndUser(value) as any
    console.log(res.data);
    setParticipants(res.data)
  }, 500)

  const handleSearch = (value: string) => {
    setSearch(value)
    findParticipants(value)
  }

  const iconCondition = (participant: any) => {
    if (participant.type === "INDIVIDUAL") {
      const index = quiz.participants.individuals.findIndex(obj => obj._id === participant._id);
      return index !== -1;
    } else {
      const index = quiz.participants.groups.findIndex(obj => obj._id === participant._id);
      return index !== -1;
    }
  };

  const toggleParticipant = (participant: any) => {
    // Check if an object with the given id already exists in the array
    if (participant.type === "INDIVIDUAL") {
      const index = quiz.participants.individuals.findIndex(obj => obj._id === participant._id);
      if (index === -1) {
        // If the object does not exist, add it to the array
        setQuiz({
          ...quiz,
          participants: {
            ...quiz.participants,
            individuals: [...quiz.participants.individuals, participant]
          }
        });
      } else {
        // If the object exists, remove it from the array
        const updatedArray = [...quiz.participants.individuals];
        updatedArray.splice(index, 1);
        setQuiz({
          ...quiz,
          participants: {
            ...quiz.participants,
            individuals: updatedArray
          }
        });
      }
    } else {
      const index = quiz.participants.groups.findIndex(obj => obj._id === participant._id);
      if (index === -1) {
        // If the object does not exist, add it to the array
        setQuiz({
          ...quiz,
          participants: {
            ...quiz.participants,
            groups: [...quiz.participants.groups, participant]
          }
        });
      } else {
        // If the object exists, remove it from the array
        const updatedArray = [...quiz.participants.groups];
        updatedArray.splice(index, 1);
        setQuiz({
          ...quiz,
          participants: {
            ...quiz.participants,
            groups: updatedArray
          }
        });
      }
    }




  };

  const removeIndividual = (individual: IUser) => {
    const updatedArray = quiz.participants.individuals.filter(obj => obj._id !== individual._id);
    setQuiz({
      ...quiz,
      participants: {
        ...quiz.participants,
        individuals: updatedArray
      }
    });
  }

  const removeGroup = (group: IGroup) => {
    const updatedArray = quiz.participants.groups.filter(obj => obj._id !== group._id);
    setQuiz({
      ...quiz,
      participants: {
        ...quiz.participants,
        groups: updatedArray
      }
    });
  }

  return (
    <div className='px-4 py-2'>
      <div className='py-4 text-2xl font-bold'>
        Add members
      </div>
      <div className='grid grid-cols-[auto,30px] items-center border-primary-light overflow-auto'>
        <input
          type="text"
          placeholder="Search"
          className='bg-primary-light focus:outline-none border-y border-l rounded-tl-full rounded-bl-full py-2 px-4'
          onChange={(e) => handleSearch(e.target.value)}
          value={search}
        />
        <div className='bg-primary-light h-full py-3 pr-6 border-y border-r rounded-r-full'><FaSearch /></div>
      </div>

      
      <div className='w-full bg-primary-light h-48 my-4 rounded-md'>
        <ul className='w-full h-full overflow-y-auto p-2'>
          {participants?.map(participant => (
            <li key={participant._id} className='flex flex-row items-center justify-between p-2 border-b border-faded'>
              <div className='flex flex-row items-center gap-2'>
                <Image
                  src={`${participant.picture ? participant.picture : "/assets/icons/avatar.svg"}`}
                  alt={participant.name}
                  width={40}
                  height={40}
                  className={`w-10 h-10 rounded-full ${participant.picture ? "" : "bg-slate-300 p-1"}`}
                />
                <div className='flex flex-col'>
                  <p className='font-semibold'>{participant.name}</p>

                  <p className='text-sm'>{participant.email}</p>
                </div>
              </div>
              <div className='w-10 h-10 flex items-center justify-center' onClick={() => { toggleParticipant(participant) }}>
                {
                  iconCondition(participant) ? <IoCheckmarkCircle className='w-full text-3xl' /> : <IoPersonAddOutline className='w-full text-3xl' />
                }
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className='pb-2 text-2xl font-bold'>
        Quiz Participants
      </div>

      <div className='w-full bg-primary-light h-48 my-4 rounded-md'>
        <ul className='w-full h-full overflow-y-auto p-2'>
          {[...quiz.participants.individuals, ...quiz.participants.groups]?.map(participant => {
            if(participant.type === "INDIVIDUAL") {
              const individual = participant as IUser
              
              return (
                <li key={individual._id} className='flex flex-row items-center justify-between p-2 border-b border-faded'>
                  <div className='flex flex-row items-center gap-2'>
                    <Image
                      src={`${individual.picture ? individual.picture : "/assets/icons/avatar.svg"}`}
                      alt={individual.name}
                      width={40}
                      height={40}
                      className={`w-10 h-10 rounded-full ${individual.picture ? "" : "bg-slate-300 p-1"}`}
                    />
                    <div className='flex flex-col'>
                      <p className='font-semibold'>{individual.name}</p>
  
                      <p className='text-sm'>{individual.email}</p>
                    </div>
                  </div>
                  <button className='w-10 h-10 flex items-center justify-center' onClick={() =>  removeIndividual(individual)}>
                    <CiCircleRemove className='w-full text-3xl' />
                  </button>
                </li>
              )
            } else if(participant.type === "GROUP") {
              const group = participant as IGroup
              return (
                <li key={group._id} className='flex flex-row items-center justify-between p-2 border-b border-faded'>
                  <div className='flex flex-row items-center gap-2'>
                    <Image
                      src={`${group.picture ? group.picture : "/assets/icons/avatar.svg"}`}
                      alt={group.name}
                      width={40}
                      height={40}
                      className={`w-10 h-10 rounded-full ${group.picture ? "" : "bg-slate-300 p-1"}`}
                    />
                    <div className='flex flex-col'>
                      <p className='font-semibold'>{group.name}</p>
                    </div>
                  </div>
                  <button className='w-10 h-10 flex items-center justify-center' onClick={() => removeGroup(group)}>
                  <CiCircleRemove className='w-full text-3xl' />
                  </button>
                </li>
              )
            }
            
          })}
        </ul>
      </div>
    </div>
  )
}