import React from "react";
import { IoMdArrowBack } from "react-icons/io";

type BackButtonProps = {
  onClick?: () => void;
};

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-[#f4f4f4] hover:text-gray-900">
      <IoMdArrowBack />
      <span>Back</span>
    </button>
  );
};
