export interface EditButtonProps {
  onAction?: () => void;
}
import { MdEdit } from "react-icons/md";

export function EditButton({ onAction }: EditButtonProps) {
  return (
    <button
      className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-300 rounded-full 
                   flex items-center justify-center hover:bg-gray-100"
      aria-label="Edit profile picture"
      onClick={onAction}>
      <MdEdit className="text-gray-500" />
    </button>
  );
}
