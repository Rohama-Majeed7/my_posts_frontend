import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/Auth";
import uploadProfilePic from "../helper/uploadiamge";

const UserData = () => {
  const { authUser, token, manageState } = useAuth();
  const userData = authUser.posts || [];
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle image upload
  const onUploadImage = async (e) => {
    const file = e.target.files[0];
    const image = await uploadProfilePic(file);
    setSelectedImage(image.url);
  };

  // Handle post submission
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "https://vercel-backend-8m5d.vercel.app/user/post",
        {
          content: data.content,
          image: selectedImage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success(res.data.msg);
        manageState();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle post deletion
  const onDelete = async (id) => {
    try {
      const res = await axios.delete(
        `https://vercel-backend-8m5d.vercel.app/user/delete/${id}`
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        manageState();
      }
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  return (
    <section className="bg-slate-800 min-h-screen text-white py-10 px-4 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-white">
          Hi, <span className="text-blue-400">{authUser.fullName}</span> 👋
        </h1>
        <Link
          to="/logout"
          className="bg-red-600 hover:bg-red-500 transition text-white font-medium py-2 px-4 rounded-lg"
        >
          Logout
        </Link>
      </div>

      {/* Create Post Form */}
      <div className="bg-white text-black rounded-xl shadow-lg p-6 max-w-4xl mx-auto mb-10">
        <h2 className="text-xl font-bold mb-4">Create a Post</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your post..."
            {...register("content", { required: true })}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}

          <input
            type="file"
            onChange={onUploadImage}
            className="block w-full text-sm text-gray-600 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-blue-600 file:text-white hover:file:bg-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Create Post
          </button>
        </form>
      </div>

      {/* User Posts */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl text-white font-semibold mb-2">Your Posts</h2>

        {userData.length === 0 ? (
          <p className="text-gray-300">No posts created yet.</p>
        ) : (
          <main className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userData.map((post, index) => {
              const postDate = new Date(post.date);
              const formattedDate = postDate.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              const time = postDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={index}
                  className="bg-white text-black rounded-lg shadow-md p-4 space-y-3"
                >
                  <div className="text-sm flex justify-between text-gray-500">
                    <span>{authUser.email}</span>
                    <span>
                      {formattedDate} at {time}
                    </span>
                  </div>

                  <p className="text-gray-800">{post.content}</p>

                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full max-w-[400px] mx-auto max-h-[200px] object-contain rounded-lg border border-gray-200"
                    />
                  )}

                  <div className="flex gap-3 justify-end">
                    <NavLink
                      to={`/profile/${post._id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
                    >
                      Edit
                    </NavLink>
                    <button
                      onClick={() => onDelete(post._id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </main>
        )}
      </div>
    </section>
  );
};

export default UserData;
