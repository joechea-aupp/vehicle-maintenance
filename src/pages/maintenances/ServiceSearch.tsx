import { useState, useEffect, useContext } from "react";
import ErrorLabel from "../../components/Errors/ErrorLabel";
import { FieldError } from "react-hook-form";
import { ThemeContext } from "../../contexts/ThemeContext";
type Props = {
  items: any[];
  errors?: any;
  status: string;
  getEditorStyle: (error?: FieldError) => string;
  addService: (service: any) => void;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export default function ServiceSearch({
  items,
  errors,
  status,
  getEditorStyle,
  addService,
  handleSearch,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectIndex, setSelectIndex] = useState(0);
  const theme = useContext(ThemeContext);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
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
        e.preventDefault();
        handleEnter();
        break;

      default:
        break;
    }
  };
  const handleEnter = () => {
    if (items.length === 0) {
      const modal = document.getElementById(
        "my_modal_1"
      ) as HTMLDialogElement | null;
      if (modal !== null) {
        modal.showModal();
      }
      return null;
    }
    const selectedItem = items[selectIndex];
    if (selectedItem) {
      addService(selectedItem);
    }
  };

  const handleMouseEnter = (index: number) => {
    setSelectIndex(index);
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      handleKeyDown(e);
    };

    // only load this event listener when the dropdown is open
    if (showDropdown) {
      document.addEventListener("keydown", handleGlobalKeyDown);
    } else {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
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
          onChange={(e) => handleSearch(e)}
        />
        {/* Conditionally render the dropdown based on showDropdown state */}
        {showDropdown && (
          <ul className="absolute z-10  border border-[#3f4145] mt-2 rounded-md shadow-md w-full">
            {items.length === 0 ? (
              <li
                className={` list-none ${
                  selectIndex === 0 ? highlightColor : ""
                }`}
                onMouseDown={() => {
                  const modal = document.getElementById(
                    "my_modal_1"
                  ) as HTMLDialogElement | null;
                  if (modal !== null) {
                    modal.showModal();
                  }
                }}
              >
                <span className="mx-2">Create new service</span>
              </li>
            ) : (
              items.map((item, index) => (
                <li
                  key={index}
                  className={`list-none ${
                    selectIndex === index ? highlightColor : ""
                  }`}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  // use onmousedown instead of onclick because onclick does not work in form.
                  onMouseDown={() => handleEnter()}
                >
                  <span className="mx-2">
                    {item.name} - {item.price}$
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box w-3/12  flex flex-col">
            <h3 className="font-bold text-lg  font-custom-two tracking-wider">
              Add New Service
            </h3>

            <form method="dialog">
              <div className="pt-5 grid grid-cols-1 gap-2">
                {/* row 1 */}
                <input
                  type="text"
                  placeholder="Service Name"
                  className="input input-bordered w-full max-w-xs"
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="input input-bordered w-full max-w-xs"
                />
                {/* row 2 */}
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="The service is for ..."
                ></textarea>
              </div>
            </form>
            <div className="modal-action">
              <button className="btn">Close</button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
}
