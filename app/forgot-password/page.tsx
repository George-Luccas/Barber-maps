import { ForgotPasswordForm } from "@/components/forgot-password-form";
import Header from "@/components/header";

export default function ForgotPasswordPage() {
  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
        <ForgotPasswordForm />
      </div>
    </>
  );
}
