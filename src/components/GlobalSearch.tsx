import { useState, useEffect, Suspense } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Await } from "react-router-dom";
import SearchItem from "./SearchItem";
import ErrorBlock from "./Errors/Error";
import { getMenu } from "../externals/searchMenu";
import { MenuData } from "../types/types";

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Toggle the menu when control k is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
        // set focus on input
        const input = document.querySelector(".input") as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }
      // Close the modal when escape is pressed
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { data: menuQuery } = useQuery({
    queryKey: ["search", ""],
    queryFn: () => getMenu(""),
  });
  const [search, setSearch] = useState<MenuData[]>([]);

  // use useEffect to update search state when menuQuery available.
  useEffect(() => {
    if (menuQuery) {
      setSearch(menuQuery);
    }
  }, [menuQuery]);
  // When the search term changes, update the query
  const queryClient = useQueryClient();
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    try {
      const newSearch = await queryClient.fetchQuery({
        queryKey: ["search", searchValue],
        queryFn: () => getMenu(searchValue),
      });
      // search term is use to track the text to highlight
      // in the search results
      setSearchTerm(searchValue);
      setSearch(newSearch);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(search);

  return (
    <div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-ghost w-40"
        onClick={() => {
          const myModel = document.getElementById(
            "my_modal_2"
          ) as HTMLDialogElement;
          if (myModel) {
            myModel.showModal();
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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
        <kbd className="kbd kbd-xs">ctrl</kbd>+
        <kbd className="kbd kbd-xs">k</kbd>
      </button>
      <dialog id="my_modal_2" className={`modal ${open ? "modal-open" : ""}`}>
        <div className="modal-box ">
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
              placeholder="Search ..."
              className="input input-bordered block pl-10"
              style={{ width: "100%" }}
              onChange={handleSearch}
              onFocus={(e) => e.target.select()}
            />
          </div>
          {/* New row for search results or recent searches */}
          <div className="divider"></div>
          <div>
            <div className="overflow-x-auto">
              <ul>
                <Suspense>
                  <Await resolve={search} errorElement={<ErrorBlock />}>
                    {(search) => {
                      return (
                        <SearchItem
                          search={search}
                          setOpen={setOpen}
                          // searchTerm is used to highlight the search term
                          searchTerm={searchTerm}
                          isOpen={open}
                        />
                      );
                    }}
                  </Await>
                </Suspense>
              </ul>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
