import { Schema, model, models } from 'mongoose';
import { IUser } from '../user/user.model';
import { IAssessment } from './assessment.model';

export interface IQuizResponse {
    _id: string;
    quiz: string;
    participant: string;
    assessment: IAssessment;
    answer: string;
    obtainedMarks: number;
    aiRemarks: string;
}

const responseSchema = new Schema({

    quiz: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },

    participant: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assessment: {
        type: Schema.Types.ObjectId,
        ref: 'Assessment',
        required: true
    },
    answer: {
        type: String,
        trim: true,
        maxlength: [3000, 'Answer must be at most 3000 characters'],
        default: ''
    },
    obtainedMarks: {
        type: Number,
        required: [true, 'Obtained marks is required'],
        default: 0
    },
    aiRemarks: {
        type: String,
        trim: true,
        default: ''
    }
},
    { timestamps: true }
);


const QuizResponse = models.QuizResponse || model('QuizResponse', responseSchema);

export default QuizResponse;