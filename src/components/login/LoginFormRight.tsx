import React from "react";

const LoginFormRight = () => {
  return (
    <div className="hidden md:block w-1/2 bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-900/10"></div>

      {/*=== Background Shapes ===*/}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full "></div>
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-blue-300/10 rounded-full  delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-indigo-300/10 rounded-full  delay-500"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-12 text-white">
        <div className="mb-8">
          <div className="inline-flex rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-4">Accelerate Your Workflow</h2>
        <p className="text-blue-100 text-lg leading-relaxed max-w-md">
          Join thousands of professionals who use our platform to deliver
          exceptional results with cutting-edge technology.
        </p>
      </div>
    </div>
  );
};

export default LoginFormRight;
