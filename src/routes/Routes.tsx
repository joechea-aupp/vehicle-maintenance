import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import VechicalMain from "../pages/VechicalMain";
import VechicalReport from "../pages/VechicalReport";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <VechicalMain /> },
      { path: "report", element: <VechicalReport /> },
    ],
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
