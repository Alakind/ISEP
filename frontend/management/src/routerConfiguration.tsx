import {createBrowserRouter} from "react-router-dom";
import App from "./App.tsx";
import {Suspense} from "react";
import LoadingPage from "./components/LoadingPage.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import UsersListPageContainer from "./containers/UsersListPageContainer.tsx";
import ApplicantsListPageContainer from "./containers/ApplicantsListPageContainer.tsx";
import ApplicantAddPageContainer from "./containers/applicant-add/ApplicantAddPageContainer.tsx";
import ApplicantPersonalPageContainer from "./containers/applicant-personal/ApplicantPersonalPageContainer.tsx";
import ApplicantInvitePageContainer from "./containers/applicant-invite/ApplicantInvitePageContainer.tsx";
import DashboardContainer from "./containers/dashboard/DashboardContainer.tsx";
import PageNotFound from "./containers/PageNotFound.tsx";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App/>,
      children: [
        {
          path: "dashboard",
          element: (
            <Suspense fallback={<LoadingPage/>}>
              <DashboardContainer/>
            </Suspense>
          ),
          children: [
            {
              path: "*",
              element: (
                <Suspense fallback={<LoadingPage/>}>
                  <DashboardContainer/>
                </Suspense>
              ),
            }
          ],
          errorElement: <ErrorBoundary error={new Error("Page not found")}/>,
        },
        {
          path: "users",
          element: (
            <Suspense fallback={<LoadingPage/>}>
              <UsersListPageContainer/>
            </Suspense>
          ),
          errorElement: <ErrorBoundary/>,
        },
        {
          path: "applicants",
          element: (
            <Suspense fallback={<LoadingPage/>}>
              <ApplicantsListPageContainer/>
            </Suspense>
          ),
          errorElement: <ErrorBoundary/>,
        },
        {
          path: "applicants",
          children: [
            {
              path: "add",
              element: (
                <Suspense fallback={<LoadingPage/>}>
                  <ApplicantAddPageContainer/>
                </Suspense>
              ),
              errorElement: (
                <ErrorBoundary/>
              ),
            },
            {
              path: ":id",
              children: [
                {
                  path: "info",
                  element: (
                    <Suspense fallback={<LoadingPage/>}>
                      <ApplicantPersonalPageContainer/>
                    </Suspense>
                  ),
                  errorElement: (
                    <ErrorBoundary/>
                  ),
                },
                {
                  path: "invite",
                  children: [
                    {
                      path: "add",
                      element: (
                        <Suspense fallback={<LoadingPage/>}>
                          <ApplicantInvitePageContainer/>
                        </Suspense>
                      ),
                      errorElement: (
                        <ErrorBoundary/>
                      ),
                    },
                  ],
                  errorElement: (
                    <ErrorBoundary/>
                  ),
                },
              ],
              errorElement: (
                <ErrorBoundary/>
              ),
            },
          ],
          errorElement: <ErrorBoundary/>,
        },
      ],
      errorElement: <ErrorBoundary/>,
    },
    {
      path: "*",
      element: (
        <Suspense fallback={<LoadingPage/>}>
          <PageNotFound/>
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
    },
    // basename: "/management",
  }
);