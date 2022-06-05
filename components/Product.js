import React from "react";
import Buy from "./Buy";
function Product({ product }) {
  const { id, name, price, description, image_url, filename, hash } = product;

  console.log(product);
  return (
    <div className="bg-white max-w-sm rounded overflow-hidden shadow-lg">
      <div className="text-center">
        <img src={image_url} alt="gif" width="300" height="300"></img>
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {price} USDC
        </span>
        <span className="inline-block text-sm font-semibold text-gray-700 mr-2 mb-2">
          <Buy itemID={id} />
        </span>
      </div>
    </div>
  );
}

export default Product;
