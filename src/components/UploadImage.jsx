import React, { useState } from "react";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { toast } from "react-hot-toast";
import { manageState } from "../store/authSlice";
import { useDispatch } from "react-redux";

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const dispatch = useDispatch();

//   const [data, setData] = useState({
//     productName: "",
//     brandName: "",
//     category: "",
//     productImage: [],
//     description: "",
//     price: "",
//     sellingPrice: "",
//   });
  const handleOnChange = async (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    // console.log(data);
    const response = await axios.post(
      "http://localhost:8080/product/upload-product",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      toast.success(response.data.msg, {
        duration: 4000,
        position: "top-center",
        icon: "👏",
        style: {
          background: "green",
          color: "white",
          fontSize: "bold",
          padding: "10px",
          border: "3px solid red",
          width: "300px",
        },
      });
      setData({
        productName: "",
        brandName: "",
        category: "",
        productImage: [],
        description: "",
        price: "",
        sellingPrice: "",
      });
      dispatch(manageState())
    }
  };
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const uploadOnCloud = await uploadImage(file);
    setData((prev) => ({
      ...prev,
      productImage: [...prev.productImage, uploadOnCloud.url],
    }));
  };

  // ===========================================
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const OnDeleteImage = async (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
        productImage: [...newProductImage],
      };
    });
  };
  // =========================================
  return (
    <React.Fragment>
      <section className=" flex h-screen justify-center w-11/12 items-center fixed top-0 bg-slate-500 bg-opacity-15">
        <form
          onSubmit={handleOnSubmit}
          className="md:w-[550px] w-10/12 bg-white shadow-lg p-2 md:p-5 h-[550px] custom-scrollbar overflow-y-scroll flex flex-col gap-2 border-2 border-red-500 rounded-md"
        >
          <div>
            <label className="mb-3">Product Image:</label>
            <input
              type="file"
              className="hidden"
              id="uploadImage"
              name="productImage"
              onChange={handleUploadImage}
            />
            <label
              htmlFor="uploadImage"
              className="cursor-pointer flex justify-center items-center bg-red-200 p-2 rounded-md h-[200px] w-full"
            >
              <input type="file" className="hidden" id="uploadIamge" />
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="h-full w-full m-auto flex  justify-center items-center"
              >
                {image ? (
                  <img
                    src={image}
                    alt="Dropped"
                    className="w-full h-full object-contain rounded-md"
                  />
                ) : (
                  <div className="flex justify-center flex-col items-center">
                    <FaCloudUploadAlt className="text-2xl" />
                    <h1 className="font-bold text-center">
                      Upload and Drag & drop an image here
                    </h1>
                  </div>
                )}
              </div>
            </label>
          </div>
          {data?.productImage[0] && (
            <div className="flex gap-1 flex-wrap">
              {data.productImage.map((el, index) => {
                return (
                  <div
                    key={index}
                    className="h-[100px] w-[100px] relative p-1 border-2 rounded-lg border-red-300"
                  >
                    <img
                      src={el}
                      alt="product"
                      className="w-full h-full"
                      onClick={() => {
                        setImageUrl(el);
                        setShowImage(true);
                      }}
                    />
                    <FaTrashAlt
                      className="absolute  bottom-1 text-red-600 "
                      onClick={() => OnDeleteImage(index)}
                    />
                  </div>
                );
              })}
            </div>
          )}
          {showImage && (
            <div className="fixed top-0 bg-gray-400 rounded-lg h-[90vh] md:h-[95vh] w-9/12 md:w-7/12 bg-opacity-35 flex justify-center">
              <div className="flex justify-center items-center ">
                <img src={imageUrl} className="w-full" />
                <IoMdClose
                  onClick={() => setShowImage(false)}
                  className="absolute top-2 right-2 text-xl bg-white rounded-full hover:bg-red-600 hover:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="price">Price:</label>
            <br />
            <input
              type="number"
              placeholder="Product Price"
              id="price"
              name="price"
              value={data.price}
              onChange={handleOnChange}
              className="w-full outline-none border border-gray-400 p-1 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="sellingPrice">Selling Price:</label>
            <br />
            <input
              type="number"
              placeholder="Product Price"
              id="sellingPrice"
              name="sellingPrice"
              value={data.sellingPrice}
              onChange={handleOnChange}
              className="w-full outline-none border border-gray-400 p-1 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="description">Product Description:</label>
            <br />
            <textarea
              type="text"
              placeholder="Product Description"
              id="description"
              name="description"
              value={data.description}
              onChange={handleOnChange}
              className="w-full outline-none border border-gray-400 p-1 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-red-500 text-white hover:bg-red-400 px-2 p-1 rounded-lg"
          >
            Upload Product
          </button>
        </form>
      </section>
    </React.Fragment>
  );
};

export default UploadImage;
