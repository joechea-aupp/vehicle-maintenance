import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
type Props = {
  search: any[];
  setOpen: (open: boolean) => void;
};
export default function SearchItem({ search, setOpen }: Props) {
  const navigate = useNavigate();
  const [selectIndex, setSelectIndex] = useState(0);

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
            className={selectIndex === index ? "bg-red-500" : ""}
            key={item.id}
            onClick={() => handleEnter()}
          >
            {item.name} <br />
            <span className="text-sm">{item.description}</span>
          </li>
        );
      })}
    </>
  );
}
