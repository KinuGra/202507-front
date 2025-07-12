"use client";
import React, { useState } from "react";

interface PushButtonProps {
  onClick?: () => void;
}

const PRESS_DURATION = 200;
const BUTTON_SIZE = 'w-48 h-48';
const INNER_BUTTON_SIZE = 'w-40 h-40';
const CENTER_SIZE = 'w-32 h-32';

export function PushButton({ onClick }: PushButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), PRESS_DURATION);
    onClick?.();
  };

  const baseTransform = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
  const pressedScale = isPressed ? 'scale-95' : '';

  return (
    <div
      className={`relative ${BUTTON_SIZE} cursor-pointer`}
      onMouseDown={handlePress}
      onTouchStart={handlePress}
    >
      <div
        className={`absolute ${BUTTON_SIZE} rounded-full bg-gray-300 transition-transform duration-200 ${
          isPressed ? 'translate-y-0' : '-translate-y-2'
        }`}
      />
      <div className="absolute inset-0 bg-gray-200 rounded-full" />
      <div
        className={`${baseTransform} ${INNER_BUTTON_SIZE} bg-red-600 rounded-full border-4 border-red-700 transition-transform duration-200 ${pressedScale}`}
      />
      <div
        className={`${baseTransform} ${CENTER_SIZE} bg-red-500 rounded-full transition-transform duration-200 ${pressedScale}`}
      />
    </div>
  );
}