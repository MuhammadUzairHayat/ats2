import React from "react";
import SignInButton from "../auth/SigninButton";
import { NextSessionProvider } from "@/contexts/session-provider";

const LoginFormLeft = () => {
  return (
    <NextSessionProvider>
      <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
        <div className="text-center md:text-left">
          <div className="flex justify-center md:justify-start items-center gap-3 mb-6">
            <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <span className="text-blue-600 text-3xl font-medium">
              Techwards
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Sign in to access your dashboard and continue your work
          </p>
        </div>

        {/* === Signin Button ===*/}
        <div className="space-y-6">
          <SignInButton />
        </div>

        <div className="mt-8 text-center md:text-left">
          <p className="text-sm text-gray-500">
            Secure authentication powered by next-auth
          </p>
        </div>
      </div>
    </NextSessionProvider>
  );
};

export default LoginFormLeft;
