import {createBrowserRouter} from "react-router-dom";
import App from "./App.tsx";
import {Suspense} from "react";
import LoadingPage from "./components/LoadingPage.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import UsersListContainer from "./containers/UsersListPageContainer.tsx";
import ApplicantsListContainer from "./containers/ApplicantsListPageContainer.tsx";
import ApplicantAddPageContainer from "./containers/applicant-add/ApplicantAddPageContainer.tsx";
import ApplicantPersonalPageContainer from "./containers/applicant-personal/ApplicantPersonalPageContainer.tsx";
import ApplicantInvitePageContainer from "./containers/applicant-invite/ApplicantInvitePageContainer.tsx";
import PageNotFound from "./containers/PageNotFound.tsx";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App/>,
      children: [
        // {
        //   path: "login",
        //   element: (
        //     <Suspense fallback={<LoadingPage />}>
        //       <div data-testid={"login"}>/login</div>
        //     </Suspense>
        //   ),
        //   errorElement: <ErrorBoundary />,
        // },
        {
          path: "settings",
          element: (
            <Suspense fallback={<LoadingPage/>}>
              <div data-testid={"settings"}>/settings</div>
              {/*TODO show the welcome message of applicant and make it able to change it and show the standard invite email and make it able to change it.*/}
            </Suspense>
          ),
          errorElement: <ErrorBoundary/>,
        },
        {
          path: "profile",
          element: (
            <Suspense fallback={<LoadingPage/>}>
              <div data-testid={"profile"}>/profile</div>
            </Suspense>
          ),
          errorElement: <ErrorBoundary/>,
        },
        {
          path: "assessments",
          element: (
            <Suspense fallback={<LoadingPage/>}>
              <div data-testid={"assessments"}>/assessments</div>
            </Suspense>
          ),
          errorElement: <ErrorBoundary/>,
        },
        {
          path: "users",
          element: (
            <Suspense fallback={<LoadingPage/>}>
              <UsersListContainer/>
            </Suspense>
          ),
          errorElement: <ErrorBoundary/>,
        },
        {
          path: "applicants",
          element: (
            <Suspense fallback={<LoadingPage/>}>
              <ApplicantsListContainer/>
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
    basename: "/management",
  }
);