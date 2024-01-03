import { createBrowserRouter, RouterProvider, defer } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getMaintenance } from "../externals/getMaintenance";
import { getVehicle } from "../externals/getVehicle";
import { getGarage } from "../externals/getGarage";
import { getTemplate } from "../externals/getTemplate";
import VechicalMain from "../pages/maintenances/VechicalMain";
import VechicalReport from "../pages/maintenances/VechicalReport";
import App from "../App";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        loader: async () => {
          const existingVehicleData = queryClient.getQueryData(["vehicle"]);
          const existingGarageData = queryClient.getQueryData(["garage"]);
          const existingTemplateData = queryClient.getQueryData(["template"]);
          if (existingVehicleData || existingGarageData) {
            // if existing, defer existing the data to the compoent
            return defer({
              vehicles: existingVehicleData,
              garages: existingGarageData,
              templates: existingTemplateData,
            });
          }

          return defer({
            // create a new query for "report" and fetch the data from getMaintenance function
            // because getMaintenance take and optional search parameter, that's why we pass an empty string
            vehicles: queryClient.fetchQuery({
              queryKey: ["vehicle"],
              queryFn: () => getVehicle(),
            }),
            garages: queryClient.fetchQuery({
              queryKey: ["garage"],
              queryFn: () => getGarage(),
            }),
            templates: queryClient.fetchQuery({
              queryKey: ["template"],
              queryFn: () => getTemplate(),
            }),
          });
        },
        element: <VechicalMain />,
      },
      {
        path: "report",
        element: <VechicalReport />,
        loader: async () => {
          /**
           * check if "report" is already in the cache
           * have to disable this, because report is has not loading yet after new data is been supplied.
           * this code should only benefit if the update and display is not the same page.
           * ```
           * const existingData = queryClient.getQueryData(["report"]);
           * if (existingData) {
           * // if existing, defer existing the data to the compoent
           *  return defer({ reports: existingData });
           *  }
           */
          const existingData = queryClient.getQueryData(["report", ""]);
          if (existingData) {
            // if existing, defer existing the data to the compoent
            return defer({ reports: existingData });
          }

          return defer({
            // create a new query for "report" and fetch the data from getMaintenance function
            // because getMaintenance take and optional search parameter, that's why we pass an empty string
            reports: queryClient.fetchQuery({
              queryKey: ["report", ""],
              queryFn: () => getMaintenance(),
            }),
          });
        },
      },
    ],
  },
]);

export function Routes() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
