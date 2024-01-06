import TextareaAutosize from "react-textarea-autosize";
import { useState, ChangeEvent } from "react";

type props = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  buttonText: string;
  range: [number, number];
};

export default function TextEditor({ content, setContent, buttonText, range }: props) {
  const [disabledButton, setDisabledButton] = useState(true);
  const [minLength, maxLength] = range;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setContent(value.replace(/\s+/g, " "));
    setDisabledButton(
      value.replace(/\s+/g, " ").length < minLength ||
        value.replace(/\s+/g, " ").length > maxLength
    );
  };

  return (
    <div>
      <TextareaAutosize
        className="mt-6 resize-none bg-bg-100 outline-none border-b-2 border-primary-100 rounded-sm w-full px-2 text-text-200 text-lg"
        autoFocus
        onChange={handleChange}
        value={content}
      />
      <div className="w-auto flex justify-end py-2">
        <h4>
          <span className={disabledButton ? "text-red-500" : ""}>
            {content?.length || 0}
          </span>
          / {maxLength}
        </h4>
      </div>
      <button
        className={disabledButton ? "disabled-button" : "button"}
        disabled={disabledButton}
      >
        {buttonText}
      </button>
    </div>
  );
}
