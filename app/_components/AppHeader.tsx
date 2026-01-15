import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import Image from "next/image";
import logo from "../../public/logo.png";

function AppHeader() {
    const { user } = useUser();
    return (
        <header className="w-full">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <Image src={logo} alt="logo" width={200} height={60} className="h-auto" />
                </div>

                <div id="navbar-collapse-with-animation" className="flex items-center gap-3">
                    {!user ? (
                        <SignInButton mode="modal">
                            <button className="rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                Get Started
                            </button>
                        </SignInButton>
                    ) : (
                        <UserButton />
                    )}
                </div>
            </div>
        </header>
    )
}

export default AppHeader
