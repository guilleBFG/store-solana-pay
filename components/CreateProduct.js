import React, { useState } from "react";
import { create } from "ipfs-http-client";

const client = create("https://ipfs.infura.io:5001/api/v0");

function CreateProduct() {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image_url: "",
    description: "",
  });

  const [file, setFile] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onChange = async (e) => {
    setUploading(true);
    const files = e.target.files;

    try {
      console.log(files[0]);
      const added = await client.add(files[0]);
      setFile({ filename: files[0].name, hash: added.path });
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
    setUploading(false);
  };

  const createProduct = async () => {
    try {
      //combine product dada with filename
      const product = { ...newProduct, ...file };
      console.log("sending product to api", product);
      const response = await fetch("../api/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      if (response.status === 200) {
        alert("Product Added");
      } else {
        alert("unable to add product", data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-xs bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400 shadow-md rounded-xl px-8 pt-6 pb-8 mb-4 text-white">
      <div>
        <div>
          <button
            className="text-lg hover:from-pink-500 hover:to-yellow-500 rounded-full hover:bg-blue-900 text-center w-full max-w-xs bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 shadow-md px-8 pt-6 pb-8 mb-4 text-white"

            onClick={() => {
              createProduct();
            }}
            disabled={uploading}
          >
            Create Product
          </button>
          <div>
            <input
              className=" block w-full text-sm  border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              type="file"
              accept=".zip, .rar, .7zip"
              placeholder="Image Pack here"
              onChange={onChange}
            />
            {file.name != null && <p className="text-lg">{file.filename}</p>}
            <div className="mt-3 mb-3">
              <label
                for="small-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Product Name
              </label>
              <input
                type="text"
                class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => {
                  setNewProduct({ ...newProduct, name: e.target.value });
                }}
              />
              <label
                for="small-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Price of USDC
              </label>
              <input
                type="text"
                class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => {
                  setNewProduct({ ...newProduct, price: e.target.value });
                }}
              />
            </div>
            <div className="mb-3">
              <label
                for="small-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                image url
              </label>
              <input
                type="url"
                class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => {
                  setNewProduct({ ...newProduct, image_url: e.target.value });
                }}
              />
            </div>
            <textarea
              id="message"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Description here..."
              onChange={(e) => {
                setNewProduct({ ...newProduct, description: e.target.value });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
