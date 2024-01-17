import TextareaAutosize from "react-textarea-autosize";
import { useState, ChangeEvent } from "react";

type Props = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  buttonText: string;
  range: [number, number];
  title: string;
};

export default function TextEditor({
  content,
  setContent,
  buttonText,
  range,
  title
}: Props) {
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
      <label className="flex items-start mt-6 gap-2">
        <span className='font-bold text-lg'>
        {title}: 
        </span>
        <TextareaAutosize
          className="resize-none bg-bg-100 outline-none border-b-2 border-primary-100 rounded-sm w-full px-2 text-text-200 text-lg"
          autoFocus
          onChange={handleChange}
          value={content}
        />
      </label>
      <div className="w-auto flex justify-end py-2">
        <h4>
          <span className={disabledButton ? "text-red-500" : ""}>
            {content?.length || 0}
          </span>
          / {maxLength}
        </h4>
      </div>
      <button
        className={disabledButton ? "disabled-button mb-4" : "button mb-4"}
        disabled={disabledButton}
      >
        {buttonText}
      </button>
    </div>
  );
}
