import Image from "next/image";
import React from "react";

function HeroButton() {
  return (
    <>
      <div className="text-2xl text-white font-semibold">
        Welcome to Store where you can buy all with crypto🤑 💵
      </div>
      <Image
        src="https://media4.giphy.com/media/yAYZnhvY3fflS/giphy.gif"
        alt="gif"
        width='600'
        height='400'
      ></Image>
    </>
  );
}

export default HeroButton;
