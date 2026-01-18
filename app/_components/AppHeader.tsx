import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import logo from "../../public/logo.png";

function AppHeader() {
    const { user } = useUser();
    return (
        <header className="sticky top-0 z-20 bg-[#26242b]/85 border-b border-white/10 backdrop-blur-xl w-full">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <Image src={logo} alt="logo" width={140} height={40} className="h-8 w-auto" />
                </Link>
                <div className="flex items-center gap-3">
                    {user && (
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-sm text-muted-foreground hover:text-primary transition">
                                Dashboard
                            </Button>
                        </Link>
                    )}
                    {!user ? (
                        <SignInButton mode="modal" signUpForceRedirectUrl="/dashboard">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition">
                                Get Started
                            </Button>
                        </SignInButton>
                    ) : (
                        <div className="app-user-button">
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonTrigger: "h-12 w-12",
                                        userButtonAvatarBox: "h-12 w-12",
                                        avatarBox: "h-12 w-12",
                                    },
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default AppHeader;
