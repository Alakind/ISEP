import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import WelcomePageContainer from "./containers/WelcomePageContainer.tsx";
import AssessmentPageContainer from "./containers/AssessmentPageContainer.tsx";
import PageNotFoundContainer from "./containers/PageNotFoundContainer.tsx";

const router = createBrowserRouter([
  {
    path: "/:inviteId",
    element: <WelcomePageContainer />,
  },
  {
    path: "assessment",
    element: <AssessmentPageContainer />,
  },
  {
    path: "*",
    element: <PageNotFoundContainer />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
