export interface EditButtonProps {
  onAction?: () => void;
}

export function EditButton({ onAction }: EditButtonProps) {
  return (
    <button
      className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-300 rounded-full 
                   flex items-center justify-center hover:bg-gray-100"
      aria-label="Edit profile picture"
      onClick={onAction}
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
  );
}
