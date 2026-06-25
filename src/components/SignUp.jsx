import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("https://vercel-backend-8m5d.vercel.app/user/signup", {
        fullName: data.name,
        email: data.email,
        password: data.password,
      });
      const user = res.data;
      if (user) {
        toast.success(user.msg);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-purple-200">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-8">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register("name", { required: true })}
              className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">Full Name is required</p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
              className="w-full px-4 py-3 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder:text-gray-400"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">Email is required</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
              className="w-full px-4 py-3 rounded-xl border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">Password is required</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition duration-200 shadow-md"
          >
            Create Account
          </button>

          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <NavLink to="/login" className="text-indigo-600 hover:underline">
              Log in
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
