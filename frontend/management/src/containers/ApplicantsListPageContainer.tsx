import ApplicantsListPage from "../components/ApplicantsListPage";
import {ApplicantInterface, InviteInterface} from "../utils/types";
import {toast} from "react-toastify";
import {getApplicants, getInvites} from "../utils/apiFunctions.tsx";
import {ReactNode, useEffect, useState} from "react";
import {NavigateFunction, useNavigate} from "react-router-dom";

function ApplicantsListPageContainer(): ReactNode {
  const [data, setData] = useState<ApplicantInterface[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>("name,asc");
  const navigate: NavigateFunction = useNavigate();
  const [query, setQuery] = useState<string>("");

  useEffect((): void => {
    async function fetchData(): Promise<void> {
      setLoading(true);
      try {
        const applicantsResponse: { data: ApplicantInterface[], totalItems: number } = await getApplicants(currentPage, itemsPerPage, orderBy, query);
        const invitesResponse: { data: InviteInterface[], totalItems: number } = await getInvites();

        let applicantsWithStatuses: ApplicantInterface[] = applicantsResponse.data;
        if (invitesResponse) {
          applicantsWithStatuses = applicantsResponse.data.map((applicant: ApplicantInterface) => {
            const applicantInvites = invitesResponse.data.filter((invite) => invite.applicantId === applicant.id);

            return {
              ...applicant,
              statuses: applicantInvites.map((invite) => invite.status),
            };
          });
        }
        setData(applicantsWithStatuses);
        setTotalItems(applicantsResponse.totalItems);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error("Unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData().then();
  }, [currentPage, itemsPerPage, orderBy, query]);

  function handleAddApplicant(): void {
    navigate("/applicants/add");
  }

  return (
    <ApplicantsListPage handleAddApplicant={handleAddApplicant} data={data} totalItems={totalItems} loading={loading} currentPage={currentPage} setCurrentPage={setCurrentPage}
                        itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} orderBy={orderBy} setOrderBy={setOrderBy} setQuery={setQuery}/>
  );
}

export default ApplicantsListPageContainer;
