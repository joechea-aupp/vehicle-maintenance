import { Datepicker, Flowbite } from "flowbite-react";
import { Controller, Control } from "react-hook-form";
import { customDatepickerTheme } from "../types/CustomTheme";
import { ThemeContextType } from "../contexts/ThemeContext";
type Props = {
  name: string;
  theme: ThemeContextType | null;
  control?: Control<any>;
  size?: "sm" | "base" | "lg" | "xl" | undefined;
  onDateChange?: (startDate?: string, endDate?: string) => void;
};
export default function Dateselecter({
  name,
  theme,
  control,
  size = "base",
  onDateChange,
}: Props) {
  return (
    <Flowbite theme={{ theme: customDatepickerTheme }}>
      <Controller
        name={name}
        control={control}
        // rules={{ required: "Start date is required" }}
        render={({ field }) => (
          <Datepicker
            {...field}
            className={theme?.theme}
            color={"primary"}
            sizing={size}
            onSelectedDateChanged={(date) => {
              const selectedDate = new Date(date);
              const day = selectedDate.getDate();
              const month = selectedDate.getMonth() + 1;
              const year = selectedDate.getFullYear();

              // const formattedDate = `${day < 10 ? "0" + day : day}-${
              //   month < 10 ? "0" + month : month
              // }-${year}`;
              const formattedDate = `${year}-${
                month < 10 ? "0" + month : month
              }-${day < 10 ? "0" + day : day}`;
              // use formattedDate as value for the input
              field.onChange(formattedDate);
              // trigger onDateChange callback
              if (onDateChange) {
                if (name === "start_date") {
                  onDateChange(formattedDate, "");
                } else if (name === "end_date") {
                  onDateChange("", formattedDate);
                }
              }
            }}
            value={field.value}
          />
        )}
      />
    </Flowbite>
  );
}
