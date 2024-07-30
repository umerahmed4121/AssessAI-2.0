'use server'

import User from "@/models/user/user.model";
import { connectToDatabase } from "@/lib/database/connection"
import { redirect } from 'next/navigation'
import { hash } from "@/utils/hash";

export async function signup(currentState: any, formData: FormData) {
  
  try {
    await connectToDatabase();
    const email = formData.get('email')
    const password = formData.get('password')
    const name = formData.get('fullName')
    const role = formData.get('role')

    console.log(email, password, name, role);
    
    const userExists = await User.findOne({ email });
    if (userExists) return { type: "error", message: 'User already exists'}

    const hashed = await hash(password as string)

    console.log(email, password, name, role, hashed);

    await User.create({ 
      name: name,
      email: email,
      hash: hashed,
      role: role
    });
    
  } catch (error: any) {
    
    return { type: "error", message: error.message}

  }
  redirect('/auth/login');
}

export async function login(currentState: any, formData: FormData) {
  try {
    await connectToDatabase();
    const email = formData.get('email')
    const password = formData.get('password')
    const user = await User.findOne({ email });
    if (!user) return { type: "error", message: 'User does not exist'}
    if (user.password !== password) return { type: "error", message: 'Invalid password'}
    
    return { type: "success", message: 'Login successful'}

  } catch (error : any) {
    return { type: "error", message: error.message}
  }
}