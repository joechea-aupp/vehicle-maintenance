import { Checkbox } from "flowbite-react";
import { useForm, FieldError } from "react-hook-form";
import {
  MaintenanceResponse,
  MaintenancePost,
  Service,
} from "../../types/types";
import ErrorLabel from "../../components/Errors/ErrorLabel";
import SubmitBtn from "../../components/Button/SubmitBtn";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useContext, useEffect, useState } from "react";
import postMaintenance from "../../externals/postMaintenance";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Dateselecter from "../../components/Dateselecter";
import ServiceSearch from "./ServiceSearch";
import { getMaintenance } from "../../externals/getMaintenance";

const getUniqueService = (
  maintenancePost: MaintenanceResponse,
  searchText: string
) => {
  const allServices = maintenancePost?.body.flatMap((data) => data.service);
  const uniqueServices = allServices?.filter(
    (service, index, self) =>
      index === self.findIndex((s) => s.name === service.name)
  );
  const matchedServices =
    searchText === ""
      ? uniqueServices
      : uniqueServices?.filter((service) => service.name.includes(searchText));
  return matchedServices;
};

export default function VechicalForm() {
  const [service, setService] = useState<Service[]>([]);
  const [ServiceSearchText, setServiceSearchText] = useState<string>("");
  const theme = useContext(ThemeContext);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MaintenancePost>();
  // function that help add service to the service array
  const addService = (newService: Service) => {
    setService((prevService) => [...prevService, newService]);
  };
  const disabledInputStyle =
    "border-none bg-transparent focus:border-none focus:ring-0 w-full text-sm";

  function getEditorStyle(fieldError: FieldError | undefined) {
    return fieldError ? "border-red-500" : "";
  }

  const queryClient = useQueryClient();
  const { mutate, status } = useMutation({
    // new version of react-query use mutationfn to run function with parameter provided
    // the mutate is eq to mutateFn which need one parameter which is data.
    mutationFn: (newMaintenance: MaintenancePost) =>
      postMaintenance(newMaintenance),
    onSuccess: (saveMaintenance) => {
      // invalidate the cache after new record is added
      queryClient.invalidateQueries({ queryKey: ["report", ""] });
      reset();
    },
  });
  const { data: maintenanceQueryData } = useQuery<MaintenanceResponse>({
    queryKey: ["report", ""],
    queryFn: () => getMaintenance(""),
  });
  const [searchService, setSearchService] = useState<Service[]>([]);
  useEffect(() => {
    if (maintenanceQueryData) {
      const initialService = getUniqueService(maintenanceQueryData, "");
      setSearchService(initialService);
    }
  }, [maintenanceQueryData]);
  async function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setServiceSearchText(event.target.value);
    try {
      const newServices = await queryClient.fetchQuery({
        queryKey: ["serviceSearch", event.target.value],
        queryFn: () => getMaintenance(`q=${event.target.value}`),
      });

      const matchedServices = getUniqueService(newServices, event.target.value);
      setSearchService(matchedServices);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    // this therefore values must be pass to the mutate function

    <form noValidate onSubmit={handleSubmit((values) => mutate(values))}>
      <div className="flex md:flex-row flex-col justify-center items-baseline">
        {/* start left side panel, maintenance record insertion */}
        <div className="grid grid-cols-2 md:gap-y-1 gap-2">
          {/* row 1 */}
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Select Vechicle</span>
              {errors.vehicle && <ErrorLabel fieldError={errors.vehicle} />}
            </label>
            <select
              className={`select select-bordered ${getEditorStyle(
                errors.vehicle
              )}`}
              {...register("vehicle", {
                required: "Vechical must be provided",
              })}
              disabled={status === "pending"}
            >
              <option value="" disabled selected>
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
              {errors.maintenance_date && (
                <ErrorLabel fieldError={errors.maintenance_date} />
              )}
            </label>
            <Dateselecter
              name="maintenance_date"
              theme={theme}
              control={control}
            />
          </div>

          {/* row 2 */}
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Current ODO</span>
              {errors.current_odo && (
                <ErrorLabel fieldError={errors.current_odo} />
              )}
            </label>
            <input
              type="text"
              placeholder="00000"
              {...register("current_odo", {
                required: "Current ODO must be provided",
              })}
              className={`input input-bordered w-full max-w-xs ${getEditorStyle(
                errors.current_odo
              )}`}
              disabled={status === "pending"}
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Future ODO</span>
              {errors.next_odo && <ErrorLabel fieldError={errors.next_odo} />}
            </label>
            <input
              type="text"
              placeholder="00000"
              {...register("next_odo", {
                required: "Next ODO must be provided",
              })}
              className={`input input-bordered w-full max-w-xs ${getEditorStyle(
                errors.next_odo
              )}`}
              disabled={status === "pending"}
            />
          </div>

          {/* row 3 */}

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Select Garage</span>
              {errors.garage && <ErrorLabel fieldError={errors.garage} />}
            </label>
            <select
              className={`select select-bordered ${getEditorStyle(
                errors.garage
              )}`}
              {...register("garage", {
                required: "Garage must be provided",
              })}
              disabled={status === "pending"}
            >
              <option value="" disabled selected>
                Pick one
              </option>
              <option>Toyota AUPP</option>
              <option>Toyota Terk Tla</option>
            </select>
          </div>
          <ServiceSearch
            items={searchService}
            errors={errors}
            status={status}
            getEditorStyle={getEditorStyle}
            addService={addService}
            handleSearch={handleSearch}
            searchText={ServiceSearchText}
          />
          {/* row 4 */}
          <div className="form-control w-full max-w-xs col-span-1">
            <label className="label">
              <span className="label-text">Upload service invoice</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
              disabled={status === "pending"}
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

              <select
                className="select select-bordered w-4/5"
                disabled={status === "pending"}
              >
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
                {service.length > 0 ? (
                  service.map((row, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>
                        <input
                          className={`truncate ${disabledInputStyle}`}
                          type="text"
                          {...register(`service.${index}.name`, {
                            required: "Service name is missing",
                          })}
                          defaultValue={row.name}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          className={`truncate ${disabledInputStyle}`}
                          type="text"
                          {...register(`service.${index}.description`, {
                            required: "Service description is missing",
                          })}
                          defaultValue={row.description}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          className={disabledInputStyle}
                          type="text"
                          {...register(`service.${index}.price`, {
                            required: "Service price is missing",
                            setValueAs: (value: string) => parseFloat(value), // set value as a number
                          })}
                          defaultValue={parseFloat(
                            Number(row.price).toFixed(2)
                          )}
                          readOnly
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="">
                    <td className="w-[35rem] py-20 text-center" colSpan={4}>
                      <span className="italic">No service added</span>
                    </td>
                  </tr>
                )}

                {/* Total row */}
                <tr className="bg-base-200">
                  <th></th>
                  <td colSpan={2} className="text-right">
                    Total:
                  </td>
                  <td>
                    $
                    {service
                      .reduce((acc, row) => Number(acc) + Number(row.price), 0)
                      .toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex gap-5 justify-end items-baseline">
            <div className="flex items-center gap-2 dark self-end pb-1.5">
              <label className="label">
                <span className="label-text">Use as template</span>
              </label>
              <Checkbox
                className={theme?.theme}
                id="template"
                disabled={status === "pending"}
              />
            </div>
            <div className="self-end">
              <SubmitBtn isSubmitting={status === "pending"} />
            </div>
            {status === "success" && (
              <div className="toast toast-start animate-fadeOut delay-1000 duration-1000">
                <div className="alert alert-success">
                  <span>Save successfully</span>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* end right side panel */}
      </div>
    </form>
  );
}
