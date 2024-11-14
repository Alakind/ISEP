import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import 'react-toastify/dist/ReactToastify.css';
import WelcomePageContainer from "./containers/WelcomePageContainer.tsx";
import AssessmentPageContainer from "./containers/AssessmentPageContainer.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePageContainer />,
  },
  {
    path: "assessment",
    element: <AssessmentPageContainer />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
