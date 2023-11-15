import {
  Flowbite,
  Datepicker,
  Label,
  TextInput,
  Checkbox,
  Table,
  Pagination,
} from "flowbite-react";
import {
  customDatepickerTheme,
  customTextInputTheme,
} from "../../types/CustomTheme";
import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useLoaderData, Await } from "react-router-dom";
import { assertIsMaintenances } from "../../externals/getMaintenance";
import { MaintenanceData } from "../../routes/types";
import VReportItem from "./VReportItem";
import { Suspense } from "react";
import ErrorBlock from "../../components/Errors/Error";
import { getMaintenance } from "../../externals/getMaintenance";

type Data = {
  reports: MaintenanceData[];
};
export function assertIsData(data: unknown): asserts data is Data {
  if (typeof data !== "object") {
    throw new Error("Data isn't an object");
  }
  if (data === null) {
    throw new Error("Data is null");
  }
  if (!("reports" in data)) {
    throw new Error("data doesn't contain posts");
  }
}

export default function VechicalReport() {
  // pagination screen resize control
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 680);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 680);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // pagination control
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page: number) => setCurrentPage(page);

  // useLoaderData get the data from the intial loader from this route
  const data = useLoaderData();
  // make sure that the data is queryclient of reports with data type of MaintenanceData[]
  assertIsData(data);

  const [reports, setReports] = useState(data.reports);

  async function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const newReports = await getMaintenance(event.target.value);
    setReports(newReports);
  }

  return (
    <div className="container mx-auto h-screen flex flex-col items-center md:block ">
      <div className="flex justify-center">
        <h1 className="text-xl font-extrabold">Report</h1>
      </div>
      <div className="divider"></div>

      <div className="grid grid-cols-3 w-2/5 gap-2 mx-32 pb-10">
        {/* row 1 */}
        <div>
          <div className="form-control w-full max-w-xs pt-[32px]">
            <select className="select select-bordered select-sm text-xs">
              <option disabled selected>
                Pick one
              </option>
              <option>Date</option>
              <option>Vehicle</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label">
            <span className="label-text-alt">Start</span>
          </label>
          <Flowbite theme={{ theme: customDatepickerTheme }}>
            <Datepicker className="dark" color={"primary"} sizing={"sm"} />
          </Flowbite>
        </div>

        <div>
          <label className="label">
            <span className="label-text-alt">End</span>
          </label>
          <Flowbite theme={{ theme: customDatepickerTheme }}>
            <Datepicker className="dark" color={"primary"} sizing={"sm"} />
          </Flowbite>
        </div>

        {/* row 2 */}
        <select className="select select-bordered select-sm max-w-xs col-span-3 w-[80px] text-xs">
          <option disabled selected>
            SEL
          </option>
          <option>AND</option>
          <option>OR</option>
        </select>

        <div>
          <div className="form-control w-full max-w-xs">
            <select className="select select-bordered select-sm text-xs">
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

        <div className="form-control w-full max-w-xs">
          <input
            type="text"
            placeholder="00000"
            className="input input-bordered w-full max-w-xs input-sm text-xs"
          />
        </div>

        <button className="btn btn-circle btn-outline btn-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
            fill="#384151"
          >
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
          </svg>
        </button>

        {/* row 3 */}
      </div>

      <div className="flex flex-col gap-5 items-center mx-32">
        <div className="max-w-md self-end">
          <div className="mb-2 block">
            <Label htmlFor="search" />
          </div>
          <Flowbite theme={{ theme: customTextInputTheme }}>
            <TextInput
              id="search"
              type="input"
              icon={FiSearch}
              placeholder="Searching..."
              required
              color={"primary"}
              className="dark"
              onChange={handleSearch}
            />
          </Flowbite>
        </div>

        <div className="w-full">
          <Table hoverable className="dark">
            <Table.Head>
              <Table.HeadCell className="p-4">
                <Checkbox />
              </Table.HeadCell>
              <Table.HeadCell>Vehicle Name</Table.HeadCell>
              <Table.HeadCell>Maintenance Date</Table.HeadCell>
              <Table.HeadCell>Garage</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {/* suspend is use to hold on the data (async) until it's complete and ready to render */}
            <Suspense fallback={<div>Loading...</div>}>
              {/* await act as await to resolve data from promise or async */}

              <Await resolve={reports} errorElement={<ErrorBlock />}>
                {(reports) => {
                  assertIsMaintenances(reports);
                  return <VReportItem reports={reports} />;
                }}
              </Await>
            </Suspense>
          </Table>
        </div>
        <div className="dark flex overflow-x-auto sm:justify-center self-end">
          <Pagination
            currentPage={currentPage}
            totalPages={100}
            onPageChange={onPageChange}
            showIcons
            layout={window.innerWidth < 680 ? "table" : undefined}
          />
        </div>
      </div>
    </div>
  );
}
