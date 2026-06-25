import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/Auth";
import uploadProfilePic from "../helper/uploadiamge";

const EditPost = () => {
  const { manageState, token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/edit/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedPost = res.data.post;

        setPost(fetchedPost);
        setSelectedImage(fetchedPost?.image || "");

        reset({
          content: fetchedPost?.content || "",
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load post details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, reset, token]);

  const onUploadImage = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setIsUploading(true);

      const image = await uploadProfilePic(file);
      setSelectedImage(image.url);

      toast.success("Image changed successfully");
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsUpdating(true);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/update/${id}`,
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

      if (res.data) {
        toast.success(res.data.msg || "Post updated successfully");
        manageState();
        navigate("/profile");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-6">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-3xl" />
      </div>

      <section className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-white p-5 text-slate-900 shadow-2xl sm:p-6">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/30">
            E
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Update Post
            </p>

            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Edit Post
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Update your content or change the attached image.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

            <p className="text-sm font-medium text-slate-600">
              Loading post...
            </p>
          </div>
        ) : !post ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center">
            <p className="text-sm font-medium text-red-600">Post not found.</p>

            <NavLink
              to="/profile"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Back to Profile
            </NavLink>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Content */}
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
                placeholder="Edit your post..."
                {...register("content", {
                  required: "Content is required",
                  minLength: {
                    value: 3,
                    message: "Content must be at least 3 characters",
                  },
                })}
                className={`w-full resize-none rounded-xl border bg-white px-3.5 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                  errors.content
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

            {/* Image Upload */}
            <div>
              <label
                htmlFor="image"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Change Image
              </label>

              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Post preview"
                      className="h-16 w-20 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-xs font-medium text-slate-500">
                      No Image
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {selectedImage ? "Image attached" : "No image attached"}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Upload a new image to replace the current one.
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="image"
                  className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  {isUploading ? "Uploading..." : "Choose Image"}
                </label>

                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={onUploadImage}
                  disabled={isUploading}
                  className="hidden"
                />
              </div>

              {selectedImage && (
                <button
                  type="button"
                  onClick={() => setSelectedImage("")}
                  className="mt-2 text-xs font-semibold text-red-500 transition hover:text-red-600 hover:underline"
                >
                  Remove image
                </button>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end">
              <NavLink
                to="/profile"
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 sm:w-auto"
              >
                Cancel
              </NavLink>

              <button
                type="submit"
                disabled={isUpdating || isUploading}
                className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
};

export default EditPost;