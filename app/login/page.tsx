import { LoginForm } from "@/components/login-form";
import Header from "@/components/header";

import { BackgroundVideo } from "@/components/ui/background-video";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background relative">
            <BackgroundVideo 
                src="/background.mp4" 
                poster="/logo1.png" // Fallback to logo or keep empty if they provide a poster
             />
            <Header />
            <main className="flex-1 flex items-center justify-center p-6 z-10">
                <LoginForm />
            </main>
        </div>
    );
}
