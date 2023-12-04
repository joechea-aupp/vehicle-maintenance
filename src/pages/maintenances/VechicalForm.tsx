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
import { useContext, useState } from "react";
import postMaintenance from "../../externals/postMaintenance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Dateselecter from "../../components/Dateselecter";
import ServiceSearch from "./ServiceSearch";
import { getMaintenance } from "../../externals/getMaintenance";

export default function VechicalForm() {
  const [service, setService] = useState<Service[]>([]);

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
      // after successfully post data, send this data new and older data to the cache
      queryClient.setQueryData<MaintenanceResponse | undefined>(
        ["report", ""],
        (oldData) => {
          if (oldData === undefined) {
            return {
              headers: new Headers(),
              body: [
                { ...saveMaintenance, service: saveMaintenance.service || [] },
              ],
            };
          } else {
            // If oldData exists, increment x-total-count by 1
            const totalCount =
              parseInt(oldData.headers.get("x-total-count") || "0", 10) + 1;
            return {
              headers: new Headers({
                "x-total-count": totalCount.toString(),
              }),
              body: [
                { ...saveMaintenance, service: saveMaintenance.service || [] },
                ...oldData.body,
              ],
            };
          }
        }
      );
      reset();
    },
  });
  const [searchService, setSearchService] = useState<Service[]>([]);
  async function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      let temporarySearch: Service[] = [];
      const newServices = await queryClient.fetchQuery({
        queryKey: ["search", event.target.value],
        queryFn: () => getMaintenance(`q=${event.target.value}`),
      });

      if (Array.isArray(newServices.body) && newServices.body.length > 0) {
        const allServices = newServices.body.flatMap((data) => data.service);
        temporarySearch = allServices;
      } else {
        temporarySearch = [];
      }

      const uniqueServices = temporarySearch.filter(
        (service, index, self) =>
          index === self.findIndex((s) => s.name === service.name)
      );

      const matchedServices =
        event.target.value === ""
          ? uniqueServices
          : uniqueServices.filter((service) =>
              service.name.includes(event.target.value)
            );
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
                {service.map((row, index) => (
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
                        defaultValue={parseFloat(row.price.toFixed(2))}
                        readOnly
                      />
                    </td>
                  </tr>
                ))}

                {/* Total row */}
                <tr className="bg-base-200">
                  <th></th>
                  <td colSpan={2} className="text-right">
                    Total:
                  </td>
                  <td>
                    $
                    {service
                      .reduce((acc, row) => acc + row.price, 0)
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
