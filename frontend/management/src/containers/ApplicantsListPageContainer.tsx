import ApplicantsListPage from "../components/ApplicantsListPage";
import {ApplicantInterface} from "../utils/types";
import {toast} from "react-toastify";
import {getApplicants} from "../utils/apiFunctions.tsx";
import {ReactNode, useEffect, useState} from "react";
import {NavigateFunction, useNavigate} from "react-router-dom";

function ApplicantsListContainer(): ReactNode {
  const [data, setData] = useState<ApplicantInterface[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>("name:asc");
  const navigate: NavigateFunction = useNavigate();

  useEffect((): void => {
    async function fetchData(): Promise<void> {
      setLoading(true);
      try {
        const res: { data: ApplicantInterface[], totalItems: number } = await getApplicants(currentPage, itemsPerPage, orderBy, "");

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

  function handleAddApplicant(): void {
    navigate("/applicants/add");
  }

  function updateData(data: ApplicantInterface[]): void {
    setData(data)
  }

  return (
    <ApplicantsListPage handleAddApplicant={handleAddApplicant} data={data} updateData={updateData} totalItems={totalItems} setTotalItems={setTotalItems} loading={loading} setLoading={setLoading}
                        currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} orderBy={orderBy} setOrderBy={setOrderBy}/>
  );
}

export default ApplicantsListContainer;
