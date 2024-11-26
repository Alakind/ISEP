import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import ApplicantsListContainer from "./containers/ApplicantsListPageContainer.tsx";
import ApplicantPageContainer from "./containers/ApplicantPageContainer";
import PageNotFoundContainer from "./containers/PageNotFoundContainer.tsx";
import LoadingPage from "./components/LoadingPage.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import UsersListContainer from "./containers/UsersListPageContainer.tsx";
import App from "./App.tsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        // {
        //   path: "login",
        //   element: (
        //     <Suspense fallback={<LoadingPage />}>
        //       <>/login</>
        //     </Suspense>
        //   ),
        //   errorElement: <ErrorBoundary error={new Error("Page not found")} />,
        // },
        {
          path: "profile",
          element: (
            <Suspense fallback={<LoadingPage />}>
              <>/profile</>
            </Suspense>
          ),
          errorElement: <ErrorBoundary error={new Error("Page not found")} />,
        },
        {
          path: "assessments",
          element: (
            <Suspense fallback={<LoadingPage />}>
              <>/assessments</>
            </Suspense>
          ),
          errorElement: <ErrorBoundary error={new Error("Page not found")} />,
        },
        {
          path: "users",
          element: (
            <Suspense fallback={<LoadingPage />}>
              <UsersListContainer />
            </Suspense>
          ),
          errorElement: <ErrorBoundary error={new Error("Page not found")} />,
        },
        {
          path: "users/:id/info",
          element: (
            <Suspense fallback={<LoadingPage />}>
              <>/users/:id/info</>
            </Suspense>
          ),
          errorElement: <ErrorBoundary error={new Error("Page not found")} />,
        },
        {
          path: "applicants",
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ApplicantsListContainer />
            </Suspense>
          ),
          errorElement: <ErrorBoundary error={new Error("Page not found")} />,
        },
        {
          path: "applicants",
          children: [
            {
              path: "add",
              element: (
                <Suspense fallback={<LoadingPage />}>
                  <>/applicants/add</>
                </Suspense>
              ),
              errorElement: (
                <ErrorBoundary error={new Error("Page not found")} />
              ),
            },
            {
              path: ":id",
              children: [
                {
                  path: "info",
                  element: (
                    <Suspense fallback={<LoadingPage />}>
                      <ApplicantPageContainer />
                    </Suspense>
                  ),
                  errorElement: (
                    <ErrorBoundary error={new Error("Page not found")} />
                  ),
                },
                {
                  path: "edit",
                  element: (
                    <Suspense fallback={<LoadingPage />}>
                      <>/applicants/:id/edit</>
                    </Suspense>
                  ),
                  errorElement: (
                    <ErrorBoundary error={new Error("Page not found")} />
                  ),
                },
                {
                  path: "invite",
                  children: [
                    {
                      path: "show",
                      element: (
                        <Suspense fallback={<LoadingPage />}>
                          <>/applicants/:id/invite/show</>
                        </Suspense>
                      ),
                      errorElement: (
                        <ErrorBoundary error={new Error("Page not found")} />
                      ),
                    },
                    {
                      path: "add",
                      element: (
                        <Suspense fallback={<LoadingPage />}>
                          <>/applicants/:id/invite/add</>
                        </Suspense>
                      ),
                      errorElement: (
                        <ErrorBoundary error={new Error("Page not found")} />
                      ),
                    },
                    {
                      path: "edit",
                      element: (
                        <Suspense fallback={<LoadingPage />}>
                          <>/applicants/:id/invite/edit</>
                        </Suspense>
                      ),
                      errorElement: (
                        <ErrorBoundary error={new Error("Page not found")} />
                      ),
                    },
                  ],
                  errorElement: (
                    <ErrorBoundary error={new Error("Page not found")} />
                  ),
                },
              ],
              errorElement: (
                <ErrorBoundary error={new Error("Page not found")} />
              ),
            },
          ],
          errorElement: <ErrorBoundary error={new Error("Page not found")} />,
        },
      ],
      errorElement: <ErrorBoundary error={new Error("Page not found")} />,
    },
    {
      path: "*",
      element: (
        <Suspense fallback={<LoadingPage />}>
          <PageNotFoundContainer />
        </Suspense>
      ),
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
      v7_partialHydration: true,
      v7_normalizeFormMethod: true,
      v7_fetcherPersist: true,
      v7_startTransition: true,
    },
    basename: "/management",
  }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
