import { Schema, model, models } from 'mongoose';
import { IGroup } from '../group/group.model';
import { IUser } from '../user/user.model';
import { IAssessment } from './assessment.model';

export interface IQuiz {
    _id: string;
    title: string;
    description: string;
    author: IUser;
    participants: {
        groups: IGroup[],
        individuals: IUser[]
    };
    assessments: IAssessment[];
    isAcceptingResponses: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const quizSchema = new Schema({

    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [50, 'Title must be at most 50 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [3000, 'Description must be at most 3000 characters'],
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: {
        type: {
            groups: {
                type: [
                    { 
                        type: Schema.Types.ObjectId,
                        ref: 'Group',
                    }
                ]
            },
            individuals: {
                type: [
                    {

                        type: Schema.Types.ObjectId,
                        ref: 'User',

                    }
                ]
            }
        }
    },
    assessments: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Assessment',
        }],
        default: []
    },
    isAcceptingResponses: {
        type: Boolean,
        default: false
    },
}, { timestamps: true});

const Quiz = models.Quiz || model('Quiz', quizSchema);

export default Quiz;
