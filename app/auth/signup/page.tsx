"use client";

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { signIn, useSession, getProviders } from "next-auth/react"
import { motion } from 'framer-motion';
import Link from 'next/link';

import { FaArrowLeft } from 'react-icons/fa';

import { FaGithub } from 'react-icons/fa';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheckCircle } from "react-icons/fa";

import { hash, verifyHash } from '@/utils/hash';

import Loader from '@/components/Loader';
import { set } from 'mongoose';
import Image from 'next/image';
import FormContainer from '@/components/FormContainer';
import Button from '@/components/Button';
import Input from '@/components/Input';
import InputPassword from '@/components/InputPassword';
import { signup } from '@/lib/actions/auth.action';
import { useFormState } from 'react-dom';
import InputRadio from '@/components/InputRadio';


const Signup = () => {

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const callbackUrl = BASE_URL + "/dashboard"
    
    const router = useRouter();
    const [state, formAction] = useFormState(signup, { type: '', message: '' });

    const [loading, setLoading] = useState(false)


    const [screen, setScreen] = useState(1)

    const [nameRef, setNameRef] = useState<null | HTMLInputElement>(null);
    const [passwordRef, setPasswordRef] = useState<null | HTMLInputElement>(null);


    const getNameRef = (ref: HTMLInputElement | null) => {
        setNameRef(ref);
    }
    const getPasswordRef = (ref: HTMLInputElement | null) => {
        setPasswordRef(ref)
    }

    useEffect(() => {
        if (state.type !== "" && state.message !== "") {
            const type = state.type as string
            toast(state.message, { type: type === 'error' ? 'error' : 'success' })
        }
    }
        , [state])


    // useEffect(() => {
    //     console.log(nameRef, passwordRef);
    //     screen === 2 && passwordRef && passwordRef.focus()
    //     screen === 3 && nameRef && nameRef.focus()
    // }, [screen]);



    return (
        <FormContainer>
            <Loader visible={loading} />
            {screen === 1 ?
                <FaArrowLeft className="invisible text-2xl" /> :
                <FaArrowLeft className="self-start text-2xl" onClick={() => {
                    screen === 2 && setScreen(1)
                    screen === 3 && setScreen(2)
                }} />
            }
            <ToastContainer
                position="top-center"
                autoClose={2000}
                limit={1}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <form className='flex flex-col justify-center w-full'
                action={formAction}
            >


                <motion.div className="w-full flex items-center justify-center p-1">
                    <Link href="/auth/signup">
                        <Image src={"/assets/logo.png"} alt="AssessAI" width={80} height={80} />
                    </Link>
                </motion.div>


                <div
                    className={`${(screen === 1 || screen === 2) ? 'w-full' : 'opacity-0 h-0 w-0'}`}
                >
                    <motion.h1

                        className="text-center text-3xl font-bold py-6"
                    >
                        Create your account
                    </motion.h1>
                    <Input
                        required
                        autoComplete="true"
                        type="email"
                        name="email"
                        label="Email"
                        className="mt-3"
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                setScreen(2)
                            }
                        }
                        }
                    />



                </div>





                <div
                    className={`${(screen === 1) ? 'w-full h-full' : 'opacity-0 h-0 w-0'}`}
                >
                    <Button
                        appearance='primary'
                        type='button'
                        onClick={() => {

                            setScreen(2)
                        }}
                        className='mt-6'
                    >Continue
                    </Button>

                    <motion.div

                        className='text-sm pt-4'>Already have an account?
                        <Link className='pl-2 text-secondary' href='/auth/login'>Log in</Link>
                    </motion.div>

                    <motion.div
                        className='flex flex-row justify-center items-center gap-2 w-full py-6 px-1'>
                        <div className='w-full h-[1px] rounded-full bg-white'></div>
                        <span className='text-sm'>OR</span>
                        <div className='w-full h-[1px] rounded-full bg-white'></div>
                    </motion.div>

                    <Button
                        appearance='secondary'
                        type="button"
                        onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000/dashboard' })}
                        className="form_button_2"
                    >
                        <span className='flex flex-row align-center justify-center gap-2'>
                            <Image
                                src="/assets/icons/google.svg"
                                alt="Google"
                                width={30}
                                height={30}
                                className='self-center' />
                            Continue with Google
                        </span>

                    </Button>
                </div>

                {/*  */}


                <div
                    className={`${(screen === 2) ? 'w-full' : 'opacity-0 h-0 w-0'}`}
                >
                    <InputPassword
                        name='password'
                        required
                        getRef={getPasswordRef}
                        label="Password"
                        autoComplete='false'
                        className='mt-3'
                        onKeyUp={(e) => {
                            if (e.target.value !== '' && e.key === 'Enter') {
                                setScreen(3)
                            }
                        }
                        }
                    />
                    <Button
                        appearance='primary'
                        type='button'
                        className=' mt-6'
                        onClick={() => setScreen(3)}
                    >Continue
                    </Button>
                </div>

                <div
                    className={`${(screen === 3) ? 'w-full' : 'opacity-0 h-0 w-0'}`}
                >
                    <motion.h1 className="text-center text-3xl font-bold pb-12">Tell us about you</motion.h1>


                    <div
                        className='flex gap-2'
                    >

                        <InputRadio
                            defaultChecked
                            required
                            name="role"
                            label="Student"
                            value="STUDENT"
                        />
                        <InputRadio
                            required
                            name="role"
                            label="Teacher"
                            value="TEACHER"
                        />
                    </div>


                    <Input
                        required
                        getRef={getNameRef}
                        type="text"
                        label="Full name"
                        name="fullName"
                        autoComplete="true"
                        className='mt-3'
                    />



                    <div className="text-sm text-center text-wrap mt-8">
                        By clicking &quot;Agree&quot;, you agree to our
                        <Link href="#" target="_blank" className='px-1 underline text-secondary' >Terms</Link>
                        and have read our
                        <Link href="#" target="_blank" className='px-1 underline text-secondary'>
                            Privacy Policy
                        </Link>
                    </div>


                    <Button

                        type="submit"
                        appearance="primary"
                        className='mt-6'
                    >
                        Agree
                    </Button>



                </div>


            </form>
















        </FormContainer>
    );
};

export default Signup;
