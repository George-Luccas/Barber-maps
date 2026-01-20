
import { FeedbackForm } from "@/components/feedback-form";
import Header from "@/components/header";

export default function FeedbackPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <FeedbackForm />
      </div>
    </>
  );
}
