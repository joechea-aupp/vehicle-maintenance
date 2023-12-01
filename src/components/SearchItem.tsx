import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
type Props = {
  search: any[];
  setOpen: (open: boolean) => void;
  searchTerm: string;
};
export default function SearchItem({ search, setOpen, searchTerm }: Props) {
  const navigate = useNavigate();
  const [selectIndex, setSelectIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const theme = useContext(ThemeContext);
  // will need to move this color to a global configuration
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

  const handleMouseEnter = (index: number) => {
    setSelectIndex(index);
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const highlightMatch = (text: string) => {
    if (!searchTerm) {
      return text;
    }

    const regex = new RegExp(`(${searchTerm})`, "i");
    return text.split(regex).map((chunk, index) => {
      return regex.test(chunk) ? (
        <span key={index} className="font-bold">
          {chunk}
        </span>
      ) : (
        <span key={index}>{chunk}</span>
      );
    });
  };

  return (
    <>
      {search.map((item: any, index) => {
        return (
          <li
            className={`py-2 ${selectIndex === index ? highlightColor : ""}`}
            key={item.id}
            onClick={() => handleEnter()}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <span className="ml-2">{highlightMatch(item.name)}</span>
            <br />
            <span className="ml-2 text-xs">
              {highlightMatch(item.description)}
            </span>
          </li>
        );
      })}
    </>
  );
}
