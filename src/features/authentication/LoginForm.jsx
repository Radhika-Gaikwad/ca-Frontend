import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import login from "../../assets/login.jpg";
import logos from "../../assets/logos.png";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
 

    <div className="h-screen flex w-full justify-between">
      <div className="hidden md:block w-[47%]">
       <img
  src={login}
  alt="Login Visual"
  className="w-full h-full object-cover"
/>

      </div>

    <img
      src={logos}
      alt="Logo"
      className="absolute top-3 right-4 lg:w-16 sm:w-16 w-14 h-auto"
    />
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
            
        <div className="w-full max-w-md mx-auto space-y-6">
   
          <div>
            <h2 className="md:text-3xl text-xl font-bold tracking-wide text-gray-900 font-serif">Welcome Back..!</h2>
             <p className="mt-1 text-sm text-gray-800 font-light">
              Enter to get unlimited access to data & information
            </p>
          </div>


          <form className="space-y-5">
      
            <div>
    <label className="block text-sm font-semibold text-black mb-1">
  Enter Phone No. <span className="text-red-500">*</span>
</label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="+91"
                  className="w-1/4 p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Enter mobile number"
                  className="w-3/4 p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

    
            <div>
        <label className="block text-sm font-semibold text-black mb-1">
  Password <span className="text-red-500">*</span>
</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full p-2 border border-gray-300 rounded pr-10"
                />
                <span
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
              </div>
              <div className="text-right mt-1">
                <a
                  href="#"
                  className="text-sm text-[#6B72D6] hover:underline"
                >
                  Forgot your Password?
                </a>
              </div>
            </div>

 
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="accent-[#6B72D6] w-4 h-4 rounded border-[#6B72D6]"
              />
              <label htmlFor="remember" className="text-sm">
                Remember Me
              </label>
            </div>

      
            <button
              type="submit"
              className="w-full py-2 bg-[#6B72D6] text-white font-semibold rounded"
            >
              Login
            </button>


            <div className="flex items-center gap-3 text-gray-500 ">
              <div className="flex-grow border-t border-solid border-gray-400" />
              <span className="text-sm">Or Login with</span>
              <div className="flex-grow border-t border-solid border-gray-400" />
            </div>

        
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded"
            >
              <FcGoogle size={22} />
              <span className="text-sm font-semibold">Sign in with Google</span>
            </button>

  
            <p className="text-center text-sm mt-2">
              Don’t have any account?{" "}
              <a href="#" className="text-[#6B72D6] font-semibold hover:underline">
                Register here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginForm;
