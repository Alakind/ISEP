import ApplicantsListPage from "../components/ApplicantsListPage";
import {ApplicantInterface} from "../utils/types";
import {toast} from "react-toastify";
import {getApplicants} from "../utils/apiFunctions.tsx";

function ApplicantsListContainer() {
  let initialData: ApplicantInterface[] = [];
  const initialCurrentPage = 0;
  const initialItemsPerPage = 10;
  let initialTotalItems = 0;
  const initialOrderBy = "name:asc"

  const fetchData = async() => {
    try {
      const res = await getApplicants(initialCurrentPage, initialItemsPerPage, initialOrderBy, "");

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
