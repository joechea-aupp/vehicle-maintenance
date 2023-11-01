import { Datepicker } from "flowbite-react";

export default function VechicalMain() {
  return (
    <div className="container mx-auto my-10 h-screen">
      <div className="flex justify-start">
        <h1 className="text-xl">Vehical Maintenance</h1>
      </div>

      <div className="divider"></div>

      <div className="flex">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Browse Template</span>
          </label>
          <select className="select select-bordered">
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
        <div className="divider divider-horizontal mx-10"></div>
        <div className="grid grid-cols-2 gap-10">
          <div className="col-span-2">Maintenance History</div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">What is your name?</span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Maintenance Date</span>
            </label>
            <Datepicker className="dark" />
          </div>
        </div>
      </div>
    </div>
  );
}
