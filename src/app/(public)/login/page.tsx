import LoginFormLeft from "@/components/login/LoginFormLeft";
import LoginFormRight from "@/components/login/LoginFormRight";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Techwards - ATS",
  description: "View and manage your recruitment dashboard",
};
export default async function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full">
        <div className="flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-md bg-white">
          {/*=== Left side - Form ===*/}
          <LoginFormLeft />

          {/*==== Right side - Visual element ====*/}
          <LoginFormRight />
        </div>
      </div>
    </div>
  );
}
