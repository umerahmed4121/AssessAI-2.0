"use server"

import Quiz, { IQuiz } from "@/models/quiz/quiz.model"
import { connectToDatabase } from "../database/connection"
import { title } from "process"
import { IUser } from "@/models/user/user.model"
import Assessment, { IAssessment } from "@/models/quiz/assessment.model"
import { generateToken, verifyToken } from "@/utils/jwt"
import QuizResponse, { IQuizResponse } from "@/models/quiz/response.model"
import { GoogleGenerativeAI } from "@google/generative-ai"


export const getQuizByCreator = async (creatorId: string) => {

    try {
        await connectToDatabase()
        console.log(creatorId);
        const quiz = await Quiz.find({author: creatorId})
        
        return {
            type: 'success',
            data: JSON.parse(JSON.stringify(quiz))
        }
    } catch (error : any) {
        return {type: 'error', message: error.message}
    }
}

export const getQuizByParticipant = async (participantId: string) => {

    try {
        await connectToDatabase()
        const quiz = await Quiz.find({
            $or: [
                {'participants.individuals': participantId},
                {'participants.groups': participantId}
            ]
        })
        return {
            type: 'success',
            data: JSON.parse(JSON.stringify(quiz))
        }
    } catch (error: any) {
        return {type: 'error', message: error.message}
    }
}

interface QuizProps {
    _id?: string,
    author: IUser,
    title: string,
    description: string,
    assessments: {
        _id?: string,
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

export const createQuiz = async (quiz: QuizProps) => {

    try {
        await connectToDatabase()
        console.log(quiz);
    
        const assessmentList : string[] = []
        const groupList : string[] = []
        const individualList : string[] = []

        for (const assess of quiz.assessments) {
            const assessment = await Assessment.create({
                question: assess.question,
                answer: assess.answer,
                totalMarks: assess.totalMarks
            })
            assessmentList.push(assessment._id)
        }

        quiz.participants.groups.map(async group => {
            groupList.push(group._id)
        })
        quiz.participants.individuals.map(async individual => {
            individualList.push(individual._id)
        })

        console.log(assessmentList, groupList, individualList);


        await Quiz.create({
            title: quiz.title,
            description: quiz.description,
            author: quiz.author._id,
            assessments: assessmentList,
            participants: {
                groups: groupList,
                individuals: individualList
            },
            isAcceptingResponses: quiz.isAcceptingResponses

        })
        return {type: 'success', message: 'Quiz created successfully'}
    }
    catch (error: any) {
        console.log("-------------------------------------------------------------------------------------------------------------------------------------------\n\nError\n\n",Date(),error);
        return {type: 'error', message: error.message}
    }
}

export const updateQuiz = async (quiz: QuizProps) => {

    try{
        await connectToDatabase()
        console.log(`
--------------------------------

In Server:
${quiz._id}

--------------------------------`);
        const assessmentList : string[] = []
        const groupList : string[] = []
        const individualList : string[] = []

        for (const assess of quiz.assessments) {
            console.log(assess);
            if (assess._id) {
            const assessment = await Assessment.findByIdAndUpdate(
                 assess._id ,
                {
                    question: assess.question,
                    answer: assess.answer,
                    totalMarks: assess.totalMarks
                })
            assessmentList.push(assessment._id)
            } else {
                const assessment = await Assessment.create({
                    question: assess.question,
                    answer: assess.answer,
                    totalMarks: assess.totalMarks
                })
                assessmentList.push(assessment._id)
            }
        }

        quiz.participants.groups.map(async group => {
            groupList.push(group._id)
        })
        quiz.participants.individuals.map(async individual => {
            individualList.push(individual._id)
        })

        



        await Quiz.findByIdAndUpdate(quiz._id, {
            title: quiz.title,
            description: quiz.description,
            assessments: assessmentList,
            participants: {
                groups: groupList,
                individuals: individualList
            },
            isAcceptingResponses: quiz.isAcceptingResponses
        })
        return {type: 'success', message: 'Quiz updated successfully'}
            
    }
    catch (error: any) {
        return {type: 'error', message: error.message}
    }

}

export const toggleQuizResponse = async (quizId: string) => {
    try {
        await connectToDatabase()
        const quiz = await Quiz.findById(quizId)
        quiz.isAcceptingResponses = !quiz.isAcceptingResponses
        await quiz.save()
        return {type: 'success', message: 'Response toggled'}
    } catch (error: any) {
        return {type: 'error', message: error.message}
    }
}

export const getQuizById = async (quizId: string) => {
    try {
        await connectToDatabase()
        const quiz = await Quiz.findById(quizId)
        .populate('author', '_id name email picture')
        .populate('assessments')
        .populate('participants.individuals', {_id: 1, name: 1, email: 1, picture: 1, type: "INDIVIDUAL"})
        .populate('participants.groups', {_id: 1, name: 1, description: 1, type: "GROUP"})
        return {type: 'success', data: JSON.parse(JSON.stringify(quiz))}
    } catch (error: any) {
        return {type: 'error', message: error.message}
    }
}

export const deleteQuiz = async (quizId: string) => {
    try {
        await connectToDatabase()
        const quiz = await Quiz.findById(quizId)
        console.log(`
Quiz flagged for deletion:

${quiz}


            `);
        for (const assess of quiz.assessments) {
            await Assessment.findByIdAndDelete(assess._id)
        }
        await Quiz.findByIdAndDelete(quizId)
        return {type: 'success', message: 'Quiz deleted successfully'}
    }
    catch (error: any) {
        return {type: 'error', message: error.message}
    }
}

export const initializeResponse = async (quizId: string, participantId:string) => {

    try {
        await connectToDatabase()
        const quiz = await Quiz.findById(quizId) as IQuiz
        if (!quiz.isAcceptingResponses) {
            return {type: 'error', message: 'Quiz is not accepting responses'}
        }

        const responses = await QuizResponse.find({
            participant: participantId,
            quiz: quizId
        })
        
        if (responses.length > 0) {
            const token = await generateToken({
                participantId: participantId,
                quizId: quizId,
            });
            return {type: 'success', data: JSON.parse(JSON.stringify(token))}
            
        } else {
            const responses: string[] = []
            for (const assessment of quiz.assessments) {
                const res = await QuizResponse.create({
                    quiz: quizId,
                    participant: participantId,
                    assessment: assessment._id,
                    answer: "",
                    obtainedMarks: 0,
                    aiRemarks: ""
                })
                responses.push(res._id)
            }
            const token = await generateToken({
                participantId: participantId,
                quizId: quizId,
            });
            return {type: 'success', data: JSON.parse(JSON.stringify(token))}
        }
    } catch (error: any) {
        return {type: 'error', message: error.message}
    }


}

export const getQuizForResponse = async (token: string) => {

    try {
        await connectToDatabase()
        const tokenData = await verifyToken(token) as any
        const quizId = tokenData.quizId 
        const participantId = tokenData.participantId
        const quiz = await Quiz.findById(quizId) as IQuiz
        const assessments : any[] = []
        for (const assessment of quiz.assessments) {
            const response = await QuizResponse.findOne({assessment: assessment._id, participant: participantId}).populate('assessment', {question: 1, totalMarks: 1})
            assessments.push({
                responseId: response._id,
                totalMarks: response.assessment.totalMarks,
                question: response.assessment.question,
                answer: response.answer,
            })
        }
        const data = {
            participantId: tokenData.participantId,
            quizId: tokenData.quizId,
            title: quiz.title,
            description: quiz.description,
            assessments: assessments
        }
        if (!quiz.isAcceptingResponses) {
            return {type: 'error', message: 'Quiz is not accepting responses'}
        } else {
            return {type: 'success', data: JSON.parse(JSON.stringify(data))}
        }
    } catch (error: any) {
        console.log(error.message);
        return {type: 'error', message: error.message}
    }


}

export const updateResponse = async (responseId: string, answer: string) => {
    try {
        await connectToDatabase()
        await QuizResponse.findByIdAndUpdate(responseId, {answer: answer})
        return {type: 'success', message: 'Response updated'}
    }
    catch (error: any) {
        return {type: 'error', message: error.message}
    }
}

export const submitResponse = async (response: any) => {
    try {
        await connectToDatabase()
        
        const { assessments } = response 
        for (const resp of assessments) {
            await QuizResponse.findByIdAndUpdate(resp.responseId, {
                answer: resp.answer
            })
        }
        
        return {type: 'success', message: 'Response submitted'}
    } catch (error: any) {
        return {type: 'error', message: error.message}
    }
}

export const getQuizResponsesByCreator = async (creatorId: string, quizId: string) => {

    try {
        await connectToDatabase()
        const quiz: IQuiz = await Quiz.findById(quizId) 
        .populate('assessments')
        const responses = await QuizResponse.find({quiz: quizId})
        // const updatedAssessments = []
        for (const assess of quiz.assessments) {
            const resps = responses.filter((response: IQuizResponse) => (assess._id.toString() === response.assessment.toString()))
            assess.responses = resps
            
        }
        
        return {type: 'success', data: JSON.parse(JSON.stringify(quiz))}
    } catch (error: any) {
        console.log(error.message);
        return {type: 'error', message: error.message}
    }
}

export const assessWithGemini = async (responseId: string) => {
    try {
        await connectToDatabase()
        const response = await QuizResponse.findById(responseId).populate('assessment') as IQuizResponse

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Compare the answer with ideal answer and give only the obtained marks out of ${response.assessment.totalMarks} not anything else.
                Question: ${response.assessment.question}
                Ideal Answer: ${response.assessment.answer}
                Participant Answer: ${response.answer}
                `;
                const result = await model.generateContent(prompt);
                const resp = await result.response;
                const text = resp.text();
                response.aiRemarks = text;

        return {type: 'success', data: JSON.parse(JSON.stringify(response))}
    }
    catch (error: any) {
        return {type: 'error', message: error.message}
    }
}

export const updateQuizGrading = async (quiz: any) => {
    try {
        await connectToDatabase()

        quiz.assessments.map(async (assessment: IAssessment) => {
            assessment.responses.map(async (response: IQuizResponse) => {
                await QuizResponse.findByIdAndUpdate(response._id, {
                    obtainedMarks: response.obtainedMarks,
                    aiRemarks: response.aiRemarks
                })
            })
        })
        return {type: 'success', message: 'Grading updated successfully '}
    }
    catch (error: any) {
        return {type: 'error', message: error.message}
    }
}