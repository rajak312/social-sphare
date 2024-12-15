import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import React from "react";

type BackButtonProps = {
  onBack?: () => void;
  title?: string;
};

export const BackButton: React.FC<BackButtonProps> = ({ onBack, title }) => {
  return (
    <div className="flex items-center p-4 font-bold">
      <button
        className="mr-2 text-gray-600 hover:text-gray-800"
        onClick={onBack}
      >
        <ArrowLeftIcon className="w-5 h-5 font-bold" />
      </button>
      <h1 className="font-medium text-lg text-gray-900 font-bold">
        {title ? title : "Back"}
      </h1>
    </div>
  );
};
