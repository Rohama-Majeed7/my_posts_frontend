import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/Auth";
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
  const { setTokenLS, manageState } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("https://vercel-backend-8m5d.vercel.app/user/login", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      const user = res.data;
      if (user) {
        setTokenLS(user.token);
        toast.success(user.msg);
        navigate("/profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }

    manageState();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-purple-200">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-6">
          Login
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
              className="w-full px-4 py-3 rounded-xl border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">Email is required</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
              className="w-full px-4 py-3 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder:text-gray-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">Password is required</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition duration-200 shadow-md"
          >
            Login
          </button>

          <p className="text-center text-gray-600 text-sm">
            Do not have an account?{" "}
            <NavLink to="/" className="text-indigo-500 hover:underline">
              Sign Up
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
