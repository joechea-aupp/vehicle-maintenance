import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
type Props = {
  search: any[];
  setOpen: (open: boolean) => void;
};
export default function SearchItem({ search, setOpen }: Props) {
  const navigate = useNavigate();
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
          Math.min(search.length - 1, prevIndex + 1)
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
    const selectedItem = search[selectIndex];
    if (selectedItem) {
      navigate(selectedItem.path);
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <>
      {search.map((item: any, index) => {
        return (
          <li
            className={`py-2 ${selectIndex === index ? highlightColor : ""}`}
            key={item.id}
            onClick={() => handleEnter()}
          >
            <span className="ml-2">{item.name} </span>
            <br />
            <span className="ml-2 text-xs">{item.description}</span>
          </li>
        );
      })}
    </>
  );
}
