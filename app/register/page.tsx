import { RegisterForm } from "@/components/register-form";
import Header from "@/components/header";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 flex items-center justify-center p-6">
                <RegisterForm />
            </main>
        </div>
    );
}
