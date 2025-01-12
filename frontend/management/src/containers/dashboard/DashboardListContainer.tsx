import "../../styles/dashboard.css";
import DashboardList from "../../components/dashboard/DashboardList.tsx";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {ApplicantInterface, InviteInterface} from "../../utils/types.tsx";
import {getApplicants, getInvites} from "../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";

function DashboardListContainer({totalItems, setTotalItems}: Readonly<Props>) {
  const [data, setData] = useState<ApplicantInterface[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>("name,asc"); //TODO reorder based on newest finished (So date (desc) and status (complete))

  useEffect((): void => {
    async function fetchData(): Promise<void> {
      setLoading(true);
      try {
        const applicantsResponse: { data: ApplicantInterface[], totalItems: number } = await getApplicants(currentPage, itemsPerPage, orderBy, "");
        const invitesResponse: InviteInterface[] = await getInvites();

        let applicantsWithStatuses: ApplicantInterface[] = applicantsResponse.data;
        if (invitesResponse) {
          applicantsWithStatuses = applicantsResponse.data.map((applicant: ApplicantInterface) => {
            const applicantInvites = invitesResponse.filter((invite) => invite.applicantId === applicant.id);

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
  }, [currentPage, itemsPerPage, orderBy]);

  return (
    <DashboardList data={data} totalItems={totalItems} loading={loading} currentPage={currentPage}
                   setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}
                   orderBy={orderBy} setOrderBy={setOrderBy}/>
  )
}

interface Props {
  totalItems: number;
  setTotalItems: Dispatch<SetStateAction<number>>
}

export default DashboardListContainer
