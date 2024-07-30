"use server"

import User from "@/models/user/user.model"
import { connectToDatabase } from "../database/connection"
import Group from "@/models/group/group.model";

export interface Student {
    _id: string;
    name: string;
    email: string;
    picture: string;
}

export const searchStudents = async (searchValue: string) => {
    try {
        if (!searchValue) {
            return { type: 'success', data: [] }
        }
        connectToDatabase()
        const students = await User.find({ role: 'STUDENT', $or: [{ name: { $regex: searchValue, $options: 'i' } }, { email: { $regex: searchValue, $options: 'i' } }] }, { _id: 1, name: 1, email: 1, picture: 1 }).limit(10)
        return {
            type: 'success',
            data: JSON.parse(JSON.stringify(students)) as Student[]
        }
    } catch (error: any) {
        return {
            type: 'error',
            message: error.message as string
        }
    }
}

export const searchInGroupsAndUser = async (searchValue: string) => {
    try {
        if (!searchValue) {
            return []
        }
        connectToDatabase()
        const students = await User.find({ $or: [{ name: { $regex: searchValue, $options: 'i' } }, { email: { $regex: searchValue, $options: 'i' } }] }, { _id: 1, name: 1, email: 1, picture: 1, type:"INDIVIDUAL" }).limit(10)
        const groups = await Group.find({ name: { $regex: searchValue, $options: 'i' } }, { _id: 1, name: 1, description: 1, type:"GROUP" }).limit(10)

        const studentsData = JSON.parse(JSON.stringify(students))
        const groupsData = JSON.parse(JSON.stringify(groups))

        return {
            type: 'success',
            data: [...studentsData, ...groupsData]
        }
    } catch (error: any) {
        return { type: 'error', message: error.message }
    }
}

export const createGroup = async (group: { author: string, name: string, description: string, members: Student[] }, formData: FormData) => {
    try {
        connectToDatabase()
        console.log(group);

        const picture = formData.get('groupProfilePicture')

        await Group.create({
            author: group.author,
            name: group.name,
            description: group.description,
            members: group.members.map(member => member._id)
        })

        return { type: 'success', message: 'Group created successfully' }
    } catch (error: any) {
        return { type: 'error', message: error.message }
    }
}

export const getGroupByCreator = async (creatorId: string) => {
    try {
        connectToDatabase()
        const groups = await Group.find({ author: creatorId }).populate('members', '_id name email picture')
        return {
            type: 'success',
            data: JSON.parse(JSON.stringify(groups))
        }

    } catch (error: any) {
        return { type: "error", message: error.message }
    }
}