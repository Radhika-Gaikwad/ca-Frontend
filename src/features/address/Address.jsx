import React from "react";
import login from "../../assets/login.jpg";
import logos from "../../assets/logos.png";
const Address = () => {
  return (
    <div className="min-h-screen flex w-full justify-between">
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
            <h2 className="md:text-3xl text-xl font-bold tracking-wide text-gray-900 font-serif">Welcome..!</h2>
            <p className="mt-1 text-sm text-gray-800 font-light">
             Give some Basic Details about you
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Enter Your Email Id <span className="text-red-500">*</span></label>
              <input
                type="email"
                placeholder="Enter your email ID"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1">Enter Door No.<span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Enter Door No"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1">Enter Street Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Enter Street Name"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1">Enter City <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Enter City"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1">Enter Country <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Enter Country"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1">PincodeEnter Pincode <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Enter Pincode"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                className="px-6 py-2 border border-gray-400 rounded hover:bg-gray-100 text-sm"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#6B72D6] text-white font-semibold rounded text-sm"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Address;
