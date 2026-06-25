import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/Auth";

const EditPost = () => {
  const { manageState } = useAuth();
  const { id } = useParams();
  const [post, setPost] = useState({});
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    axios.get(`http://localhost:4000/user/edit/${id}`).then((res) => {
      setPost(res.data.post);
    });
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await axios.put(`https://vercel-backend-8m5d.vercel.app/user/update/${id}`, {
        content: data.content,
      });

      if (res.data) {
        toast.success(res.data.msg);
        navigate("/profile");
      } else {
        toast.error("Something went wrong");
      }

      manageState();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-start pt-16 px-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl text-white">
        <h1 className="text-3xl font-semibold text-center mb-6">Edit Your Post</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <textarea
              className="w-full h-40 resize-none p-4 rounded-xl bg-white/10 border border-white/30 placeholder:text-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder={post.content || "Edit your post..."}
              {...register("content", { required: true })}
            />
            {errors.content && (
              <p className="text-red-400 text-sm mt-1">Content is required</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-medium rounded-xl transition"
            >
              Save Changes
            </button>

            <NavLink
              to="/profile"
              className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-medium rounded-xl transition"
            >
              Back to Profile
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
