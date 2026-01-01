import { ResetPasswordForm } from "@/components/reset-password-form";
import Header from "@/components/header";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
        <Suspense fallback={<div>Carregando...</div>}>
            <ResetPasswordForm />
        </Suspense>
      </div>
    </>
  );
}
