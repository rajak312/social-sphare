import { useState, useEffect, useRef } from "react";

export const FeedText = ({ text }: { text: string }) => {
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }
  }, [text]);

  const handleToggleText = () => {
    setIsTextExpanded((prev) => !prev);
  };

  return (
    <div className="mt-4 mb-4">
      <p
        ref={textRef}
        className={`overflow-hidden transition-all duration-300 ${
          isTextExpanded ? "max-h-none" : "max-h-[3.5rem]"
        }`}
        style={{ whiteSpace: "normal", textOverflow: "ellipsis" }}
      >
        {text}
      </p>
      {isOverflowing && (
        <button
          onClick={handleToggleText}
          className="text-blue-500 font-normal mt-1"
        >
          {isTextExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};
