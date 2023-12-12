type Props = {
  modalId: string;
  data: any[];
  action: (data: any[]) => void;
};
export default function Confirm({ modalId, data, action }: Props) {
  return (
    <>
      <dialog id={modalId} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm</h3>
          <p className="py-4">Are you sure you want to delete this item?</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn px-8 mr-5" onClick={() => action(data)}>
                Yes
              </button>
              <button className="btn px-8">No</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
