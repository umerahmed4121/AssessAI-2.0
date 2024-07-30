import { Schema, model, models } from 'mongoose';
import { IQuizResponse } from './response.model';


export interface IAssessment {
    _id: string;
    question: string;
    answer: string;
    totalMarks: number;
    responses: IQuizResponse[];
}

const assessmentSchema = new Schema({

    question: {
        type: String,
        required: [true, 'Question is required'],
        trim: true,
        minlength: [3, 'Question must be at least 3 characters'],
        maxlength: [3000, 'Question must be at most 3000 characters'],
    },
    answer: {
        type: String,
        required: [true, 'Answer is required'],
        trim: true,
        minlength: [1, 'Answer must be at least 1 characters'],
        maxlength: [3000, 'Answer must be at most 3000 characters'],
    },
    totalMarks: {
        type: Number,
        required: [true, 'Total marks is required'],
    },
    responses: {
        type:[{
            type: Schema.Types.ObjectId,
            ref: 'QuizResponse',
        }]

    }
}, { timestamps: true });
   

const Assessment =  models.Assessment || model('Assessment', assessmentSchema);
export default Assessment;

