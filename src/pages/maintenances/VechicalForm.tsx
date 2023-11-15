import { Flowbite, Datepicker, Checkbox } from "flowbite-react";
import { customDatepickerTheme } from "../../types/CustomTheme";
import { useForm } from "react-hook-form";

export default function VechicalForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>();
  return (
    <form>
      <div className="flex md:flex-row flex-col justify-center items-baseline">
        {/* start left side panel, maintenance record insertion */}
        <div className="grid grid-cols-2 md:gap-y-1 gap-2">
          {/* row 1 */}
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Select Vechicle</span>
            </label>
            <select className="select select-bordered">
              <option disabled selected>
                Pick one
              </option>
              <option>Toyota Rush</option>
              <option>Lexus RX200</option>
              <option>Toyota Prius</option>
            </select>
          </div>

          <div>
            <label className="label">
              <span className="label-text">Maintenance Date</span>
            </label>
            <Flowbite theme={{ theme: customDatepickerTheme }}>
              <Datepicker className="dark" color={"primary"} sizing={"base"} />
            </Flowbite>
          </div>

          {/* row 2 */}
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Current ODO</span>
            </label>
            <input
              type="text"
              placeholder="00000"
              className="input input-bordered w-full max-w-xs"
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Future ODO</span>
            </label>
            <input
              type="text"
              placeholder="00000"
              className="input input-bordered w-full max-w-xs"
            />
          </div>

          {/* row 3 */}

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Select Garage</span>
            </label>
            <select className="select select-bordered">
              <option disabled selected>
                Pick one
              </option>
              <option>Toyota AUPP</option>
              <option>Toyota Terk Tla</option>
            </select>
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Search Service</span>
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

              <button className="btn btn-square btn-outline absolute inset-y-0 right-0 btn-sm my-auto mr-1">
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
                className="input input-bordered block pl-10"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* row 4 */}
          <div className="form-control w-full max-w-xs col-span-1">
            <label className="label">
              <span className="label-text">Upload service invoice</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
            />
          </div>
        </div>
        {/* end maintenance record insertion */}

        <div className="divider md:divider-horizontal"></div>

        {/* Starting right side, template and item pricing */}
        <div className="flex flex-col gap-10  ml-1 pb-5 md:w-auto w-full">
          <div className="form-control w-full max-w-xs md:self-start self-center">
            <div className="md:block flex justify-center w-full">
              <label className="label">
                <span className="label-text whitespace-nowrap overflow-hidden pr-3">
                  Browse Template
                </span>
              </label>

              <select className="select select-bordered w-4/5">
                <option disabled selected>
                  Pick one
                </option>
                <option>Star Wars</option>
                <option>Harry Potter</option>
                <option>Lord of the Rings</option>
                <option>Planet of the Apes</option>
                <option>Star Trek</option>
              </select>
            </div>
          </div>

          <div className="w-full">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                  <td>$10.0</td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>2</th>
                  <td>Hart Hagerty</td>
                  <td>Desktop Support Technician</td>
                  <td>$25.2</td>
                </tr>
                {/* row 3 */}
                <tr>
                  <th>3</th>
                  <td>Brice Swyre</td>
                  <td>Tax Accountant</td>
                  <td>$40.1</td>
                </tr>
                <tr>
                  <th>4</th>
                  <td>Brice Swyre</td>
                  <td>Tax Accountant</td>
                  <td>$40.1</td>
                </tr>
                <tr>
                  <th>5</th>
                  <td>Brice Swyre</td>
                  <td>Tax Accountant</td>
                  <td>$40.1</td>
                </tr>
                <tr className="bg-base-200">
                  <th></th>
                  <td colSpan={2} className="text-right">
                    Total:
                  </td>
                  <td>$75.3</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex gap-5 justify-end items-baseline">
            <div className="flex items-center gap-2 dark self-end pb-1.5">
              <label className="label">
                <span className="label-text">Use as template</span>
              </label>
              <Checkbox id="template" />
            </div>
            <div className="self-end">
              <input type="submit" value="Submit" className="btn" />
            </div>
          </div>
        </div>
        {/* end right side panel */}
      </div>
    </form>
  );
}
