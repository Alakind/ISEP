import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import ApplicantsListContainer from "./containers/ApplicantsListContainer";
import ApplicantPageContainer from "./containers/ApplicantPageContainer";

const router = createBrowserRouter([
  {
    path: "/applicants",
    element: <ApplicantsListContainer />,
  },
  {
    path: "/applicants/:id",
    element: <ApplicantPageContainer />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
