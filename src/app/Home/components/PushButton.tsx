"use client";
import React, { useState } from "react";

const PushButton = () => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200); // Reset after 200ms
  };

  return (
    <div
      className="relative w-48 h-48 cursor-pointer"
      onMouseDown={handlePress}
      onTouchStart={handlePress}
    >
      <div
        className={`absolute w-48 h-48 rounded-full bg-gray-300 transition-transform duration-200 ${
          isPressed ? "transform translate-y-0" : "transform -translate-y-2"
        }`}
      ></div>
      <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
      <div
        className={`absolute w-40 h-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full border-4 border-red-700 transition-transform duration-200 ${
          isPressed ? "transform -translate-x-1/2 -translate-y-1/2 scale-95" : ""
        }`}
      ></div>
      <div
        className={`absolute w-32 h-32 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full transition-transform duration-200 ${
          isPressed ? "transform -translate-x-1/2 -translate-y-1/2 scale-95" : ""
        }`}
      ></div>
    </div>
  );
};

export default PushButton;