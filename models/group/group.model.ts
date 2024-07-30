import { model, models, Schema } from "mongoose";


export interface IGroup {
    _id: string;
    author: string;
    name: string;
    description: string;
    picture: string;
    members: string[];
    createdAt: string;
    updatedAt: string;
}


const groupSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        required: [true, 'Author is required'],
        ref: 'User'
    },
    name:{
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters'],
        maxlength: [50, 'Name must be at most 50 characters'],
    },
    description:{
        type: String,
        trim: true,
        maxlength: [3000, 'Description must be at most 3000 characters'],
    },
    picture: String,
    members: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'User'
    }

},
{
    timestamps: true
});

const Group = models?.Group || model('Group', groupSchema);
export default Group 