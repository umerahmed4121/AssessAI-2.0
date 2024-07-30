"use client"

import { useRouter, useSearchParams } from "next/navigation"
import React, { useState, FormEvent, MouseEvent, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"


import { motion } from "framer-motion"

import { signIn } from "next-auth/react"

import { FaArrowLeft } from 'react-icons/fa';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from "@/components/Loader"
import Input from "@/components/Input"
import Button from "@/components/Button"
import FormContainer from "@/components/FormContainer"
import Page from "@/components/Page"
import { useFormState } from "react-dom"
import { signup } from "@/lib/actions/auth.action"
import InputPassword from "@/components/InputPassword"

const Login = () => {


    const callbackUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    const [state, formAction] = useFormState(signup, { type: '', message: '' });

    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
      })
    const [loading, setLoading] = useState(false)

    const [screen, setScreen] = useState(1)

    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const code = searchParams.get('code');

    useEffect(() => {
        if (error === 'AccessDenied') {
            setScreen(2)
            toast.error("Invalid credentials")
        }
    }, [error])

    useEffect(() => {
        if (state.type !== "" && state.message !== "") {
            const type = state.type as string
            toast(state.message, { type: type === 'error' ? 'error' : 'success' })
        }
    }
        , [state])


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // setLoading(true)
        await signIn('credentials', { email: formData.email, password: formData.password, callbackUrl: '/' })
        // setLoading(false)
    }

    return (
        <FormContainer>
            <Loader visible={loading} />
            {screen === 1 ?
                <FaArrowLeft className="invisible text-2xl" /> :
                <FaArrowLeft className="self-start text-2xl" onClick={() => screen === 2 && setScreen(1)} />
            }
            <ToastContainer position="top-center" autoClose={2000} limit={1} hideProgressBar={true} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"
            />
            <motion.div className="w-full flex items-center justify-center p-1">
                <Link href="/auth/login">
                <Image src={"/assets/logo.png"} alt="AssessAI" width={80} height={80} />
                </Link>
            </motion.div>

            <motion.h1

                className="text-center text-3xl font-bold py-6"
            >
                Welcome back
            </motion.h1>


            <form 
            onSubmit={handleSubmit}
            className="w-full flex flex-col justify-center items-center">
                <Input
                    required
                    name="email"
                    autoComplete="email"
                    type="email"
                    label="Email"
                    onChange={(e) => {setFormData({...formData, email: e.target.value})}}
                    value={formData.email}
                />


                <Page
                    showPage={screen === 1}
                >
                    <Button
                        className="mt-4"
                        type='button'
                        appearance="primary"
                        onClick={() => setScreen(2)}
                    >
                        Continue
                    </Button>
                    <motion.div

                        className='text-sm mt-4'>Don&apos;t have an account?
                        <Link className='pl-2 text-secondary' href='/auth/signup'>Sign up</Link>
                    </motion.div>

                    <motion.div

                        className='flex flex-row justify-center items-center gap-2 w-full py-6 px-1'>
                        <div className='w-full h-[1px] rounded-full bg-white'></div>
                        <span className='text-sm'>OR</span>
                        <div className='w-full h-[1px] rounded-full bg-white'></div>
                    </motion.div>

                    <Button
                        type="button"
                        appearance="secondary"
                        key={"google"}
                        onClick={async () => {
                            setLoading(true)
                            await signIn("google", { callbackUrl: callbackUrl })
                        }}

                    >
                        <span className='flex flex-row align-center justify-center gap-2'>
                            <Image
                                src="/assets/icons/google.svg"
                                alt="Google"
                                width={30}
                                height={30}
                                className='self-center' />
                            Continue with Google</span>

                    </Button>



                </Page>

                <Page
                    showPage={screen === 2}>
                    <InputPassword
                        name="password"
                        required
                        label="Password"
                        autoComplete="current-password"
                        onChange={(e) => {setFormData({...formData, password: e.target.value})}}
                        value={formData.password}
                        className="mt-2"
                    />
                    <div className="mt-4"><Link className='text-secondary' href='/'>Forgot password?</Link></div>



                    <Button
                        type="submit"
                        appearance="primary"
                        className='form_button mt-6'
                    >Continue
                    </Button>

                </Page>

            </form>



        </FormContainer >
    )

}

export default Login;