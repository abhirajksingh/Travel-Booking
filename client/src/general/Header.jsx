import React from "react";
import img from "../general/logo.png";

function Header() {
  return (
    <div className="flex justify-between items-center font-bold bg-gray-800 text-white pl-2 z-50 fixed  w-full top-0 text-center">
      <div className="flex py-4 items-center ">
        <img src={img} alt="" className="w-16 h-10 dropShadow" />
        <p className="pl-4 text-xl">Travels</p>
      </div>
      <div className="flex py-4 flex-cols">
        <p className="cursor-pointer px-4 text-xl">Flight</p>
        <p className="cursor-pointer px-4 text-xl">Hotel</p>
      </div>
      <div className="p-4">
        <button className="text-md px-3 py-2 border-2 border-solid border-cyan-500 box-shadow  rounded-lg bg-cyan-500">
          Login/Sign Up
        </button>
      </div>
    </div>
  );
}

export default Header;
