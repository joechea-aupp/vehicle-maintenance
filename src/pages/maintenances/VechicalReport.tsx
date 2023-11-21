import {
  Flowbite,
  Label,
  TextInput,
  Checkbox,
  Table,
  Pagination,
} from "flowbite-react";
import { customTextInputTheme } from "../../types/CustomTheme";
import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useLoaderData, Await } from "react-router-dom";
import { assertIsMaintenances } from "../../externals/getMaintenance";
import { MaintenanceData, MaintenanceID } from "../../types/types";
import VReportItem from "./VReportItem";
import { Suspense } from "react";
import ErrorBlock from "../../components/Errors/Error";
import { getMaintenance } from "../../externals/getMaintenance";
import SkeletonRow from "../../components/Skeletons/SkeletonRow";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useContext } from "react";
import delMaintenance from "../../externals/delMaintenance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RxDropdownMenu } from "react-icons/rx";
import { useForm } from "react-hook-form";
import Dateselecter from "../../components/Dateselecter";

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
  const theme = useContext(ThemeContext);

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

  // update data to report table
  const [reports, setReports] = useState(data.reports);
  // handle action for search button
  async function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const newReports = await getMaintenance(event.target.value);
    setReports(newReports);
  }
  // update checkbox action for table report data
  const [checkedReport, setCheckedReport] = useState<number[]>([]);
  const onCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    reportId: number
  ) => {
    if (e.target.checked) {
      // add reportId to checkedReport
      setCheckedReport([...checkedReport, reportId]);
    } else {
      // remove reportId from checkedReport
      setCheckedReport(checkedReport.filter((id) => id !== reportId));
    }
  };
  // handle data from deleted button to table report, this also include cache
  const queryClient = useQueryClient();
  const { mutate, status } = useMutation({
    // new version of react-query use mutationfn to run function with parameter provided
    // the mutate is eq to mutateFn which need one parameter which is data.
    mutationFn: (maintenanceID: MaintenanceID) => delMaintenance(maintenanceID),
    onSuccess: () => {
      // after successfully post data, send this data new and older data to the cache
      queryClient.setQueryData<MaintenanceData[] | undefined>(
        ["report", ""],
        (oldData) => {
          if (oldData === undefined) {
            return [
              // return data from cache that filter out checkedReport
            ];
          } else {
            // return olddata that filter out checkedReport array
            const newData = oldData.filter(
              (item) => !checkedReport.includes(item.id)
            );

            setReports(newData);
            return newData;
          }
        }
      );
    },
  });
  // handle delete action on the delete button.
  const onDelete = async (maintenanceIDs: MaintenanceID[]) => {
    try {
      const deletedMaintenanceItems = maintenanceIDs.map((id) => mutate(id));
      await Promise.all(deletedMaintenanceItems);
    } catch (error) {
      console.error(error);
    }
  };
  const { control } = useForm();

  return (
    <div className="container mx-auto h-screen flex flex-col items-center md:block mb-28">
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
          <Dateselecter
            name="start_date"
            theme={theme}
            control={control}
            size="sm"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text-alt">End</span>
          </label>
          <Dateselecter
            name="end_date"
            theme={theme}
            control={control}
            size="sm"
          />
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
        <div className="flex space-x-5 self-end">
          <div className={`dropdown`}>
            <label tabIndex={0} className="btn m-1">
              <RxDropdownMenu />
              <span>Action</span>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Export</a>
              </li>
              <li>
                {/* onclick run onDelete function */}
                <a onClick={() => onDelete(checkedReport)}>Delete</a>
              </li>
            </ul>
          </div>

          <div className="max-w-md ">
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
                className={theme?.theme}
                onChange={handleSearch}
              />
            </Flowbite>
          </div>
        </div>

        <div className="w-full">
          <Table
            hoverable
            className={`bg-transparent shadow-md ${theme?.theme}`}
          >
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
            <Suspense fallback={<SkeletonRow />}>
              {/* await act as await to resolve data from promise or async */}
              <Await resolve={reports} errorElement={<ErrorBlock />}>
                {status === "pending" ? (
                  <SkeletonRow />
                ) : (
                  (reports) => {
                    assertIsMaintenances(reports);
                    return (
                      <VReportItem
                        reports={reports}
                        onCheckboxChange={onCheckboxChange}
                      />
                    );
                  }
                )}
              </Await>
            </Suspense>
          </Table>
          {status === "success" && (
            <div className="toast toast-start animate-fadeOut delay-1000 duration-1000">
              <div className="alert alert-success">
                <span>Deleted successfully.</span>
              </div>
            </div>
          )}
        </div>
        <div
          className={`flex overflow-x-auto sm:justify-center self-end ${theme?.theme}`}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={onPageChange}
            showIcons
            layout={window.innerWidth < 680 ? "table" : undefined}
          />
        </div>
      </div>
    </div>
  );
}
