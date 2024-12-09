import {EnvelopeIcon, LockClosedIcon} from "@heroicons/react/24/outline";
import prisma from "@/common/libs/prisma";
import {GetServerSideProps, NextPage} from "next";
import {FormEvent, Ref, useRef, useState} from "react";
import {signIn} from "next-auth/react";
import Button from "@/common/components/atomic/Button";
import {hash} from "bcrypt";
import Link from "@/common/components/atomic/Link";

const Home: NextPage = () => {
    const emailInput: Ref<HTMLInputElement> = useRef(null)
    const passwordInput: Ref<HTMLInputElement> = useRef(null)
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true)
        await signIn('credentials', {
            email: emailInput.current?.value,
            password: passwordInput.current?.value,
            callbackUrl: '/dashboard'
        });
    };

    return (
        <main
            className="flex justify-center items-center min-h-screen min-w-full bg-cover text-primary"
            style={{backgroundImage: "url('/img/login/building.webp')"}}
        >
            <div
                className="flex flex-col gap-10 mx-6 w-full md:w-[65%] lg:w-[52.5%] xl:w-[40%] backdrop-blur-sm bg-white/30 px-12 py-14 rounded-2xl shadow-xl"
            >
                <div className='flex justify-center max-h-[5rem]'>
                    <img src="/img/logo-blue-1.svg" alt="Logo Tandeem"/>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-7">
                        <div className="flex flex-col gap-4">
                            <label htmlFor="email" className="flex items-center gap-2">
                                <EnvelopeIcon className="w-5 h-5"/> Email
                            </label>
                            <input
                                ref={emailInput}
                                type="email"
                                id="email"
                                className="bg-white text-black w-full px-3 py-3.5 rounded-lg ring-2 ring-primary focus:outline-none focus:ring-secondary transition duration-200 ease-in-out"
                                placeholder="xyz@tandeem.ma"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="floating_password"
                                   className="flex items-center gap-2">
                                <LockClosedIcon className="w-5 h-5"/> Mot de passe
                            </label>
                            <input
                                ref={passwordInput}
                                type="password"
                                id="password"
                                className="bg-white text-black w-full px-3 py-3.5 rounded-lg ring-2 ring-primary focus:outline-none focus:ring-secondary transition duration-200 ease-in-out"
                                placeholder="****"
                                required
                            />
                        </div>
                        <Link href="/forgot-password" internal className="text-primary hover:text-primary font-medium">
                            Mot de passe oublié?
                        </Link>
                        <Button
                            className='py-4 text-lg'
                            icon='ArrowLeftOnRectangleIcon'
                            text='Se connnecter'
                            loading={loading}
                        />
                    </div>
                </form>
            </div>
        </main>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    await prisma
        .user
        .upsert({
            where: {email: 'admin@tandeem.ma'},
            update: {},
            create: {
                email: 'admin@tandeem.ma',
                password: await hash('password', 12),
                role: "TANDEEM",
            }
        })

    return {props: {}}
}

export default Home;