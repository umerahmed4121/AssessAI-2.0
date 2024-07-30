import { model, models, Schema } from "mongoose";

export interface IUser{
    _id: string;
    name: string;
    email: string;
    hash?: string;
    picture?: string;
    role: string;
}

const userSchema = new Schema<IUser>({
    name:{
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters'],
        maxlength: [50, 'Name must be at most 50 characters'],
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        minlength: [5, 'Email must be at least 5 characters'],
        maxlength: [255, 'Email must be at most 255 characters'],
    },
    hash: String,
    picture: String,
    role:{
        type: String,
        enum: ['STUDENT', 'TEACHER'],
        default: 'STUDENT'
    },

},
{
    timestamps: true
});

const User = models?.User || model('User', userSchema);
export default User 