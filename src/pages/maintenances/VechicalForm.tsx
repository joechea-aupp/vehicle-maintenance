import { Flowbite, Datepicker, Checkbox } from "flowbite-react";
import { customDatepickerTheme } from "../../types/CustomTheme";
import { useForm, FieldError, Controller } from "react-hook-form";
import { MaintenancePost, Service, MaintenanceData } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ErrorLabel from "../../components/Errors/ErrorLabel";
import SubmitBtn from "../../components/Button/SubmitBtn";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useContext } from "react";
import postMaintenance from "../../externals/postMaintenance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function VechicalForm() {
  const theme = useContext(ThemeContext);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<MaintenancePost>();

  const navigate = useNavigate();

  const tableRows: Service[] = [
    {
      name: "Cy Ganderton",
      description: "Quality Control Specialist",
      price: 10.0,
    },
    {
      name: "Hart Hagerty",
      description: "Desktop Support Technician",
      price: 25.2,
    },
    { name: "Brice Swyre", description: "Tax Accountant", price: 40.1 },
    // Add more rows as needed
  ];

  const disabledInputStyle =
    "border-none bg-transparent focus:border-none focus:ring-0 w-full text-sm";

  function getEditorStyle(fieldError: FieldError | undefined) {
    return fieldError ? "border-red-500" : "";
  }

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    // new version of react-query use mutationfn to run function with parameter provided
    // the mutate is eq to mutateFn which need one parameter which is data.
    mutationFn: (newMaintenance: MaintenancePost) =>
      postMaintenance(newMaintenance),
    onSuccess: (saveMaintenance) => {
      // after successfully post data, send this data new and older data to the cache
      queryClient.setQueryData<MaintenanceData[] | undefined>(
        ["report"],
        (oldData) => {
          if (oldData === undefined) {
            return [
              { ...saveMaintenance, service: saveMaintenance.service || [] },
            ];
          } else {
            return [
              { ...saveMaintenance, service: saveMaintenance.service || [] },
              ...oldData,
            ];
          }
        }
      );

      setTimeout(() => {
        reset();
      }, 3000);
      // navigate("/report");
    },
  });

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
              disabled={isSubmitting}
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
            <Flowbite theme={{ theme: customDatepickerTheme }}>
              <Controller
                name="maintenance_date"
                control={control}
                rules={{ required: "Date must be provided" }}
                render={({ field }) => (
                  <Datepicker
                    {...field}
                    onSelectedDateChanged={(date) => {
                      // const formattedDate = new Date(date).toLocaleDateString(
                      //   "en-GB"
                      // ); dd/mm/yyyy format
                      const selectedDate = new Date(date);
                      const day = selectedDate.getDate();
                      const month = selectedDate.getMonth() + 1; // Months are zero-based
                      const year = selectedDate.getFullYear();

                      // Ensure leading zeros for day and month
                      const formattedDate = `${day < 10 ? "0" : ""}${day}-${
                        month < 10 ? "0" : ""
                      }${month}-${year}`;

                      field.onChange(formattedDate);
                      field.onChange(formattedDate);
                    }}
                    value={field.value}
                    className={theme?.theme}
                    color="primary"
                    sizing="base"
                    disabled={isSubmitting}
                  />
                )}
              />
            </Flowbite>
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              <option value="" disabled selected>
                Pick one
              </option>
              <option>Toyota AUPP</option>
              <option>Toyota Terk Tla</option>
            </select>
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Search Service</span>
              {errors.service?.[0]?.name && (
                <ErrorLabel fieldError={errors.service?.[0]?.name} />
              )}
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

              <button
                className="btn btn-square btn-outline absolute inset-y-0 right-0 btn-sm my-auto mr-1"
                disabled={isSubmitting}
              >
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
                className={`input input-bordered block pl-10 ${getEditorStyle(
                  errors.service?.[0]?.name ?? undefined
                )}`}
                style={{ width: "100%" }}
                disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                {tableRows.map((row, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>
                      <input
                        className={disabledInputStyle}
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
                        className={disabledInputStyle}
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
                    {tableRows
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
                disabled={isSubmitting}
              />
            </div>
            <div className="self-end">
              <SubmitBtn isSubmitting={isSubmitting} />
            </div>
            {isSubmitSuccessful && (
              <div className="toast toast-top toast-start">
                <div className="alert alert-success">
                  <span>Message sent successfully.</span>
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
