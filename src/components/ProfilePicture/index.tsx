import { useRef, useState } from "react";

export interface ProfilePictureProps {
  url: string;
  onEdit?: (file: File) => void;
}

export function ProfilePicture({ url, onEdit }: ProfilePictureProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      onEdit?.(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative w-24 h-24">
      <img
        src={file ? URL.createObjectURL(file) : url}
        className="w-24 h-24 rounded-full object-cover border border-gray-300"
      />

      <button
        className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-300 rounded-full 
                   flex items-center justify-center hover:bg-gray-100"
        aria-label="Edit profile picture"
        onClick={handleButtonClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.232 5.232l3.536 3.536m-2.036-4.036a2.5 
       2.5 0 113.536 3.536L9 20.5H4.5V16l12.732-12.732z"
          />
        </svg>
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
