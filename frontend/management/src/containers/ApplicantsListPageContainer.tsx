import ApplicantsListPage from "../components/ApplicantsListPage";
import {ApplicantInterface} from "../utils/types";
import {toast} from "react-toastify";
import {getApplicants} from "../utils/apiFunctions.tsx";
import {ReactNode} from "react";

function ApplicantsListContainer(): ReactNode {
  let initialData: ApplicantInterface[] = [];
  const initialCurrentPage = 0;
  const initialItemsPerPage = 10;
  let initialTotalItems = 0;
  const initialOrderBy = "name:asc"

  async function fetchData(): Promise<void> {
    try {
      const res: {data: ApplicantInterface[], totalItems: number} = await getApplicants(initialCurrentPage, initialItemsPerPage, initialOrderBy, "");

      initialData = res.data;
      initialTotalItems =res.totalItems;
    } catch (error: any) {
      toast.error(error.message)
    }
  }
  fetchData().then();

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
