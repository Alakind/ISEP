import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {RouterProvider} from "react-router-dom";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import {router} from "./routerConfiguration.tsx";
import {ThemeProvider} from "./ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router}/>
    </ThemeProvider>
  </StrictMode>
);
