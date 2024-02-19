// import React, { useState } from "react";
import Search from "./Search";
import "../flight/Search.css";

function Models({ open }) {
  if (!open) return null;

  return (
    <div className="overlay">
      <Search />
    </div>
  );
}

export default Models;
