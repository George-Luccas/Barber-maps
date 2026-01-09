import { LoginForm } from "@/components/login-form";
import Header from "@/components/header";

import { BackgroundVideo } from "@/components/ui/background-video";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background relative">
             <BackgroundVideo 
                src="https://videos.pexels.com/video-files/852423/852423-sd_640_360_25fps.mp4" 
                poster="https://images.pexels.com/videos/852423/free-video-852423.jpg"
             />
            <Header />
            <main className="flex-1 flex items-center justify-center p-6 z-10">
                <LoginForm />
            </main>
        </div>
    );
}
