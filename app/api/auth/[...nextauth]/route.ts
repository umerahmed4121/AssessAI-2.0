import { connectToDatabase } from '@/lib/database/connection';

import User from '@/models/user/user.model';
import { verifyHash } from '@/utils/hash';
import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";


export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials, req) {
                const { email, password } = credentials;
                await connectToDatabase();
                const user = await User.findOne({ email });
                if (!user) return null
                const isValid = verifyHash(password as string, user.hash);
                if (!isValid) return null;
                return user;
            }
        }),
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET
        })

    ],
    callbacks: {
        async session({ session }) {
            
            await connectToDatabase();
            const user = await User.findOne({ email: session?.user?.email}, { hash: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            return { ...session, user };
        },
        async signIn({ user, account, profile, email, credentials }) {
            try {
                console.log({ user, account, profile, email, credentials });
                await connectToDatabase();

                const userExist = await User.findOne({ email: profile?.email });

                if (account?.provider === 'google') {

                    if (userExist && userExist?.hash) return false;
                    else if (userExist) return true;
                    else {
                        await User.create({
                            name: profile?.name,
                            email: profile?.email,
                            picture: profile?.picture,
                        });
                    }
                    return true;
                } else if (account?.provider === 'credentials') {
                    const credentialsEmail = credentials?.email
                    const credentialsPassword = credentials?.password
                    const user = await User.findOne({ email:credentialsEmail });
                    if (!user) return false
                    const isValid = await verifyHash(credentialsPassword as string, user.hash as string);
                    if (!isValid) return false;
                    return true;
                }

            } catch (error) {
                console.log('error', error);
            }
            return false;
        }
    },

    pages: {
        signIn: '/auth/login',
        signOut: '/',
        error: '/auth/login',
        verifyRequest: '/auth/login',
    },

});