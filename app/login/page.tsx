import { LoginForm } from "@/components/login-form";
import Header from "@/components/header";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 flex items-center justify-center p-6">
                <LoginForm />
            </main>
        </div>
    );
}
