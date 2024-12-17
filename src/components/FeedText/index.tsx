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

  const renderTextWithHashtags = (text: string) => {
    const regex = /(#\w+)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.match(regex)) {
        return (
          <span key={index} className="text-blue-500">
            {part}
          </span>
        );
      }
      return part;
    });
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
        {renderTextWithHashtags(text)}
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
