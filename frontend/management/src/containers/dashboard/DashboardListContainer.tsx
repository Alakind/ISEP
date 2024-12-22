import "../../styles/dashboard.css";
import DashboardList from "../../components/dashboard/DashboardList.tsx";
import {useEffect, useState} from "react";
import {ApplicantInterface} from "../../utils/types.tsx";
import {getApplicants} from "../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";

function DashboardListContainer() {
  const [data, setData] = useState<ApplicantInterface[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>("name:asc"); //TODO reorder based on newest finished (So date (desc) and status (complete))

  useEffect((): void => {
    async function fetchData(): Promise<void> {
      setLoading(true);
      try {
        const res: {
          data: ApplicantInterface[],
          totalItems: number
        } = await getApplicants(currentPage, itemsPerPage, orderBy, "");

        setData(res.data);
        setTotalItems(res.totalItems);
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

export default DashboardListContainer
