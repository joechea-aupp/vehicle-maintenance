import { useState, useEffect, useContext } from "react";
import ErrorLabel from "../../components/Errors/ErrorLabel";
import { FieldError } from "react-hook-form";
import { ThemeContext } from "../../contexts/ThemeContext";
type Props = {
  items: any[];
  errors?: any;
  status: string;
  getEditorStyle: (error?: FieldError) => string;
};
export default function ServiceSearch({
  items,
  errors,
  status,
  getEditorStyle,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectIndex, setSelectIndex] = useState(0);
  const theme = useContext(ThemeContext);
  const highlightColor =
    theme?.theme === "dark" ? "bg-[#297491]" : "bg-slate-300";
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        setSelectIndex((prevIndex) => Math.max(0, prevIndex - 1));
        break;

      case "ArrowDown":
        setSelectIndex((prevIndex) =>
          Math.min(items.length - 1, prevIndex + 1)
        );
        break;

      case "Enter":
        handleEnter();
        break;

      default:
        break;
    }
  };
  const handleEnter = () => {
    const selectedItem = items[selectIndex];
    if (selectedItem) {
      // navigate(selectedItem.path);
      // setOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">Search Service</span>
        {errors?.service?.[0]?.name && (
          <ErrorLabel fieldError={errors.service?.[0]?.name} />
        )}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <button
          className="btn btn-square btn-outline absolute inset-y-0 right-0 btn-sm my-auto mr-1"
          disabled={status === "pending"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
            fill="#384151"
          >
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
          </svg>
        </button>

        <input
          type="text"
          placeholder="Type here"
          className={`input input-bordered block pl-10 ${getEditorStyle(
            errors.service?.[0]?.name ?? undefined
          )}`}
          style={{ width: "100%" }}
          disabled={status === "pending"}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setShowDropdown(false)}
        />
        {/* Conditionally render the dropdown based on showDropdown state */}
        {showDropdown && (
          <ul className="absolute z-10  border border-[#3f4145] mt-2 rounded-md shadow-md w-full">
            {items.map((item, index) => (
              <li
                key={index}
                className={`mx-2 list-none ${
                  selectIndex === index ? highlightColor : ""
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
