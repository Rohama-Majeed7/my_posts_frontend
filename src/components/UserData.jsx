import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/Auth";
import uploadProfilePic from "../helper/uploadiamge";

const UserData = () => {
  const { authUser, token, manageState } = useAuth();

  const userData = authUser?.posts || [];

  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });
  const convertDateTimeTo12Hour = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  const onUploadImage = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setIsUploading(true);

      const image = await uploadProfilePic(file);
      setSelectedImage(image.url);

      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsCreating(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/post`,
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
        toast.success(res.data.msg || "Post created successfully");
        reset();
        setSelectedImage(null);
        manageState();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setIsCreating(false);
    }
  };

  const onDelete = async (id) => {
    setDeletingId(id);

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/user/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message || "Post deleted successfully");
        manageState();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-black/10 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-sm text-slate-400">Dashboard</p>

            <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">
              Hi,{" "}
              <span className="text-indigo-400">
                {authUser?.fullName || "User"}
              </span>{" "}
              👋
            </h1>

            <p className="mt-1 max-w-xl text-sm text-slate-400">
              Create, manage, and update your posts from one clean place.
            </p>
          </div>

          <Link
            to="/logout"
            className="inline-flex items-center justify-center rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/30"
          >
            Logout
          </Link>
        </header>

        {/* Create Post Card */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-white p-5 text-slate-900 shadow-2xl sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Create a Post
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Share your thoughts and optionally attach an image.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="content"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Post Content
              </label>

              <textarea
                id="content"
                rows="4"
                placeholder="Write your post..."
                {...register("content", {
                  required: "Post content is required",
                  minLength: {
                    value: 3,
                    message: "Post content must be at least 3 characters",
                  },
                })}
                className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${errors.content
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                  }`}
              />

              {errors.content && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="image"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Upload Image
              </label>

              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={onUploadImage}
                className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-sm text-slate-600 outline-none transition file:mr-4 file:border-0 file:bg-indigo-600 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700 focus:ring-4 focus:ring-indigo-100"
              />

              {isUploading && (
                <p className="mt-2 text-xs font-medium text-indigo-600">
                  Uploading image...
                </p>
              )}

              {selectedImage && (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Image Preview
                  </p>

                  <img
                    src={selectedImage}
                    alt="Selected preview"
                    className="max-h-56 w-full rounded-lg object-contain"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isCreating || isUploading}
              className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-8"
            >
              {isCreating ? "Creating Post..." : "Create Post"}
            </button>
          </form>
        </section>

        {/* Posts Section */}
        <section>
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-white sm:text-xl">
                Your Posts
              </h2>

              <p className="text-sm text-slate-400">
                {userData.length} {userData.length === 1 ? "post" : "posts"}{" "}
                created
              </p>
            </div>
          </div>

          {userData.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center shadow-xl">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-2xl">
                📝
              </div>

              <h3 className="text-lg font-semibold text-white">
                No posts created yet
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Start by creating your first post above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {userData.map((post) => {

                return (
                  <article
                    key={post._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl"
                  >
                    <div className="p-5">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {authUser?.fullName || "User"}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {authUser?.email}
                          </p>
                        </div>

                        <p className="shrink-0 text-right text-xs leading-5 text-slate-400">
                          {convertDateTimeTo12Hour(post.date)}
                          {/* <br />
                          {time} */}
                        </p>
                      </div>

                      <p className="whitespace-pre-line break-words text-sm leading-6 text-slate-700">
                        {post.content}
                      </p>
                    </div>

                    {post.image && (
                      <div className="border-y border-slate-100 bg-slate-50 px-4 py-3">
                        <img
                          src={post.image}
                          alt="Post"
                          className="max-h-64 w-full rounded-xl object-contain"
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-2 p-4 sm:flex-row sm:justify-end">
                      <NavLink
                        to={`/profile/${post._id}`}
                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                      >
                        Edit
                      </NavLink>

                      <button
                        type="button"
                        onClick={() => onDelete(post._id)}
                        disabled={deletingId === post._id}
                        className="inline-flex items-center justify-center rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {deletingId === post._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default UserData;