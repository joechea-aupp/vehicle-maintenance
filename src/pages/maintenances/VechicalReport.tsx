/* eslint-disable jsx-a11y/anchor-is-valid */
import { Flowbite, Label, TextInput, Checkbox, Table } from "flowbite-react";
import { customTextInputTheme } from "../../types/CustomTheme";
import Pagination from "../../components/Pagination";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import { useLoaderData, Await } from "react-router-dom";
import { assertIsMaintenances } from "../../externals/getMaintenance";
import {
  MaintenanceResponse,
  MaintenanceData,
  MaintenanceID,
} from "../../types/types";
import VReportItem from "./VReportItem";
import { Suspense } from "react";
import ErrorBlock from "../../components/Errors/Error";
import { getMaintenance } from "../../externals/getMaintenance";
import SkeletonRow from "../../components/Skeletons/SkeletonRow";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useContext } from "react";
import delMaintenance from "../../externals/delMaintenance";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { RxDropdownMenu } from "react-icons/rx";
import { useForm } from "react-hook-form";
import Dateselecter from "../../components/Dateselecter";
import ColumnTitle from "../../components/ColumnTitle";

type Data = {
  reports: MaintenanceResponse;
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
  const data = useLoaderData();
  // make sure that the data is queryclient of reports with data type of MaintenanceData[]
  assertIsData(data);
  // pagination control
  const [currentPage, setCurrentPage] = useState(1);
  const [displayRow, setDisplayRow] = useState(
    Number(localStorage.getItem("displayRow")) || 5
  ); // default display row is 5
  // on select change, update display row
  const handleDisplayRow = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const largerRow = displayRow < Number(event.target.value);
    setDisplayRow(Number(event.target.value));
    localStorage.setItem("displayRow", event.target.value);

    // condition to check if the data is already in cache and the new display row is larger than the current display row
    // if cache data is larger than the current display row, no need to fetch for new data, just display the cache data
    if (largerRow) {
      const cachedData = queryClient.getQueryData<
        MaintenanceResponse | undefined
      >(["report", ""]);

      if (cachedData) {
        if (cachedData.body.length < Number(event.target.value)) {
          const newReports = await queryClient.fetchQuery({
            queryKey: ["report", ""],
            queryFn: () => getMaintenance(`_limit=${event.target.value}`),
          });
          setReports(newReports);
        }
      }
    }
  };

  // update data to report table
  const [reports, setReports] = useState(data.reports);
  // useLoaderData get the data from the intial loader from this route

  // handle action for search button
  async function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const newReports = await queryClient.fetchQuery({
        queryKey: ["report", ""],
        queryFn: () =>
          getMaintenance(`q=${event.target.value}&_limit=${displayRow}`),
      });
      setReports(newReports);
    } catch (error) {
      console.error(error);
    }
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
    onSuccess: async () => {
      // after successfully post data, send this data new and older data to the cache
      // queryClient.setQueryData<MaintenanceResponse | undefined>(
      //   ["report", ""],
      //   (oldData) => {
      //     if (oldData === undefined) {
      //       return undefined;
      //     } else {
      //       // return olddata that filter out checkedReport array
      //       const newData = {
      //         headers: oldData.headers,
      //         body: oldData.body.filter(
      //           (item) => !checkedReport.includes(item.id)
      //         ),
      //       };
      //       setReports(newData);
      //       return newData;
      //     }
      //   }
      // );
      // this way work better tham the above, update new cache data with the new data from the server
      const newReports = await queryClient.fetchQuery({
        queryKey: ["report", ""],
        queryFn: () => getMaintenance(`_limit=${displayRow}`),
      });
      setReports(newReports);
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
  // handle sort action on the table report
  const [sortDescending, setSortDescending] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("");
  const onSort = async (fieldName: string) => {
    // const cachedData = queryClient.getQueryData<
    //   MaintenanceResponse | undefined
    // >(["report", ""]);

    const cachedData = await queryClient.fetchQuery({
      queryKey: ["report", ""],
      queryFn: () =>
        getMaintenance(
          `_limit=${displayRow}&_sort=${fieldName}&_order=${
            sortDescending ? "asc" : "desc"
          }`
        ),
    });

    if (cachedData) {
      const isDescending = sortBy === fieldName && !sortDescending;
      const sortedData: MaintenanceResponse = {
        headers: cachedData.headers,
        body: cachedData.body.slice().sort((a, b) => {
          if (fieldName === "maintenance_date") {
            const dateA = String(a[fieldName]) ? a[fieldName] : "";
            const dateB = String(b[fieldName]) ? b[fieldName] : "";

            const parsedDateA = new Date(dateA.split("-").reverse().join("-"));
            const parsedDateB = new Date(dateB.split("-").reverse().join("-"));
            const compareResult = parsedDateA.getTime() - parsedDateB.getTime();

            return isDescending ? -compareResult : compareResult;
          } else if (fieldName === "price") {
            // For the 'price' field, directly compare the numbers
            return isDescending
              ? b.service.reduce((acc, service) => acc + service.price, 0) -
                  a.service.reduce((acc, service) => acc + service.price, 0)
              : a.service.reduce((acc, service) => acc + service.price, 0) -
                  b.service.reduce((acc, service) => acc + service.price, 0);
          } else {
            const valueA = a[fieldName as keyof MaintenanceData];
            const valueB = b[fieldName as keyof MaintenanceData];
            const compareResult =
              valueA > valueB ? 1 : valueA < valueB ? -1 : 0;

            return isDescending ? -compareResult : compareResult;
          }
        }),
      };

      queryClient.setQueryData<MaintenanceResponse | undefined>(
        ["report", ""],
        sortedData
      );

      setReports(sortedData);
      setSortBy(fieldName);
      setSortDescending(isDescending);
    }
  };

  async function onPaginationChange(page: number) {
    try {
      const newReports = await queryClient.fetchQuery({
        queryKey: ["report", ""],
        queryFn: () => getMaintenance(`_limit=${displayRow}&_page=${page}`),
      });
      setReports(newReports);
      setCurrentPage(page);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container mx-auto h-full flex flex-col items-center md:block mb-28">
      <div className="flex justify-center">
        <h1 className="text-3xl font-extrabold font-custom-two tracking-wider">
          Report
        </h1>
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
        <div className="w-full flex space-x-5 justify-center items-center">
          <div className="w-full">
            <select
              className="select select-bordered select-sm text-sm w-[80px] h-1/2 max-w-xs"
              onChange={handleDisplayRow}
              value={displayRow}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div className={`dropdown w-40`}>
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

          <div className="max-w-md pb-2">
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

        <div className="w-full h-max">
          <Table
            hoverable
            className={`bg-transparent shadow-md ${theme?.theme}`}
          >
            <Table.Head>
              <Table.HeadCell className="p-4">
                <Checkbox />
              </Table.HeadCell>
              <Table.HeadCell>
                <ColumnTitle
                  fieldName="vehicle"
                  isSortable={true}
                  onSort={onSort}
                >
                  Vehicle Name
                </ColumnTitle>
              </Table.HeadCell>
              <Table.HeadCell>
                <ColumnTitle
                  fieldName="maintenance_date"
                  isSortable={true}
                  onSort={onSort}
                >
                  {" "}
                  Maintenance Date
                </ColumnTitle>
              </Table.HeadCell>
              <Table.HeadCell>
                <ColumnTitle
                  fieldName="garage"
                  isSortable={true}
                  onSort={onSort}
                >
                  Garage
                </ColumnTitle>
              </Table.HeadCell>
              <Table.HeadCell>
                <ColumnTitle
                  fieldName="price"
                  onSort={onSort}
                  isSortable={true}
                >
                  Price
                </ColumnTitle>
              </Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {/* suspend is use to hold on the data (async) until it's complete and ready to render */}
            <Suspense fallback={<SkeletonRow />}>
              {/* await act as await to resolve data from promise or async */}
              <Await resolve={reports} errorElement={<ErrorBlock />}>
                {(reports) => {
                  assertIsMaintenances(reports.body);
                  // this to prvent data from cache to display incorrect lenght after added.
                  const paginatedReports = reports.body.slice(0, displayRow); // Show only the first 5 records
                  return (
                    <VReportItem
                      reports={paginatedReports}
                      onCheckboxChange={onCheckboxChange}
                    />
                  );
                }}
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
          <Suspense>
            <Await resolve={reports}>
              {(reports) => {
                return (
                  <Pagination
                    totalPages={Number(reports.headers.get("x-total-count"))}
                    onChange={onPaginationChange}
                    currentPage={currentPage}
                    displayPerPage={displayRow}
                  />
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
