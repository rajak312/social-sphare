import { useRef, useState } from "react";
import { EditButton } from "../EditButton";

export interface ProfilePictureProps {
  url?: string;
  withoutPreview?: boolean;
  onEdit?: (file: File) => void;
}

export function ProfilePicture({
  url,
  onEdit,
  withoutPreview,
}: ProfilePictureProps) {
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

  function renderEditButton() {
    return (
      <>
        <EditButton onAction={handleButtonClick} />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </>
    );
  }

  if (withoutPreview) {
    return renderEditButton();
  }

  return (
    <div className="relative w-24 h-24">
      <img
        src={file ? URL.createObjectURL(file) : url}
        className="w-24 h-24 rounded-full object-cover border border-gray-300"
      />
      {renderEditButton()}
    </div>
  );
}
