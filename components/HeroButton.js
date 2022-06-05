import React from "react";
import { Icon } from '@iconify/react';
function HeroButton() {
  return (
    <>
      <div className=" p-4 flex text-2xl text-white font-semibold">
        Welcome to Store where you can buy all with crypto
        <Icon className="mt-1 ml-4" icon="emojione-v1:dollar-banknote" width="30" height="30" />
        <Icon className="mt-1 ml-4" icon="logos:bitcoin" width="30" height="30" />
      </div>
     
    </>
  );
}

export default HeroButton;
