import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import WelcomePageContainer from "./containers/WelcomePageContainer.tsx";
import InterviewPageContainer from "./containers/InterviewPageContainer.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePageContainer />,
  },
  {
    path: "interview",
    element: <InterviewPageContainer />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
