import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter an email and password');
                }

                await dbConnect();

                const user = await User.findOne({ email: credentials.email });

                if (!user || !user.password) {
                    throw new Error('No user found with that email');
                }

                const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordCorrect) {
                    throw new Error('Invalid password');
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    // Don't return image here to avoid JWT bloat
                    role: user.role,
                    department: user.department,
                    designation: user.designation,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.department = (user as any).department;
                token.designation = (user as any).designation;
                // Use API route for avatar to keep token small
                token.picture = `/api/users/${user.id}/avatar`;
            }

            if (trigger === "update" && session?.user) {
                // Filter out image from session update to prevent token bloat
                const { image, ...rest } = session.user;
                const tokenUpdate = { ...token, ...rest };

                // Allow updating image only if it's a URL (short), to support cache busting query params
                // Prevent large base64 strings
                if (image && typeof image === 'string' && image.length < 200) {
                    tokenUpdate.picture = image;
                }

                return tokenUpdate;
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).department = token.department;
                (session.user as any).designation = token.designation;
                (session.user as any).image = token.picture;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: "mcfin-docs-development-secret-key-change-this",
};
