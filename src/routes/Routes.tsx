import { createBrowserRouter, RouterProvider, defer } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getMaintenance } from "../externals/getMaintenance";
import VechicalMain from "../pages/maintenances/VechicalMain";
import VechicalReport from "../pages/maintenances/VechicalReport";
import App from "../App";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <VechicalMain /> },
      {
        path: "report",
        element: <VechicalReport />,
        loader: async () => {
          // check if "report" is already in the cache
          const existingData = queryClient.getQueryData(["report"]);
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
