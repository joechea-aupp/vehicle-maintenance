export default function GlobalSearch() {
  return (
    <div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-ghost btn-circle"
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
      </button>
      <dialog id="my_modal_2" className="modal">
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
              placeholder="Type here"
              className="input input-bordered block pl-10"
              style={{ width: "100%" }}
            />
          </div>
          {/* New row for search results or recent searches */}
          <div className="divider"></div>
          <div>
            <div className="overflow-x-auto">
              <table className="table-auto ml-10">
                <tbody>
                  <tr>
                    <td>Recent Search ...</td>
                  </tr>
                </tbody>
              </table>
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
