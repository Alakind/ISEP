import ApplicantsListPage from "../components/ApplicantsListPage";
import {ApplicantInterface} from "../utils/types";
import {toast} from "react-toastify";
import {getApplicants} from "../utils/apiFunctions.tsx";

function ApplicantsListContainer() {
  let initialData: ApplicantInterface[] = [];
  const initialCurrentPage = 0;
  const initialItemsPerPage = 10;
  let initialTotalItems = 0;
  const initialOrderBy = "name:desc"

  const fetchData = async() => {
    try {
      //TODO uncomment this when there is a working api
      const res = await getApplicants(initialCurrentPage, initialItemsPerPage, initialOrderBy, "");

      /*const res = {
        data: [
          {
            name: "Sasha Surname",
            id: "1234567890",
            email: "Sasha@email.com",
            score: 100,
            status: ApplicantStatuses.APP_ASSESSMENT_IN_PROGRESS,
            preferredLanguage: PreferredLanguages.SQL,
          },
          {
            name: "Everard Surname",
            id: "234567890",
            email: "Everard@email.com",
            score: 90,
            status: ApplicantStatuses.APP_FINISHED,
            preferredLanguage: PreferredLanguages.SQL,
          },
          {
            name: "Jesse Surname",
            id: "34567890",
            email: "Jesse@email.com",
            score: 80,
            status: ApplicantStatuses.APP_INVITED_ASSESSMENT,
            preferredLanguage: PreferredLanguages.SQL,
          },
          {
            name: "Ruben Surname",
            id: "4567890",
            email: "Ruben@email.com",
            score: 70,
            status: ApplicantStatuses.ASSESSMENT_EXPIRED,
            preferredLanguage: PreferredLanguages.SQL,
          },
          {
            name: "Jarno Surname",
            id: "567890",
            email: "Jarno@email.com",
            score: 60,
            status: ApplicantStatuses.CANCELLED,
            preferredLanguage: PreferredLanguages.SQL,
          },
        ],
        totalItems: 5
      }*/
      initialData = res.data;
      initialTotalItems =res.totalItems;
    } catch (error: any) {
      toast.error(error.message)
    }
  }
  fetchData();

  return (
    <ApplicantsListPage
      initialData={initialData}
      initialCurrentPage={initialCurrentPage}
      initialItemsPerPage={initialItemsPerPage}
      initialTotalItems={initialTotalItems}
      initialOrderBy={initialOrderBy}
    />
  );
}

export default ApplicantsListContainer;
