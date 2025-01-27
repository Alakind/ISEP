import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import WelcomePageContainer from "./containers/WelcomePageContainer.tsx";
import AssessmentPageContainer from "./containers/AssessmentPageContainer.tsx";
import PageNotFoundContainer from "./containers/PageNotFoundContainer.tsx";
import {ThemeProvider} from "./utils/providers/ThemeProvider.tsx";
import FinishPageContainer from "./containers/FinishPageContainer.tsx";

const router = createBrowserRouter([
  {
    path: "/:inviteId",
    element: <WelcomePageContainer/>,
  },
  {
    path: "assessment",
    element: <AssessmentPageContainer/>,
  },
  {
    path: "finish",
    element: <FinishPageContainer/>,
  },
  {
    path: "*",
    element: <PageNotFoundContainer/>,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router}/>
    </ThemeProvider>
  </StrictMode>
);
