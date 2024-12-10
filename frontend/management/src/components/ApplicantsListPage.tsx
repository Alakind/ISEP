import {ApplicantInterface} from "../utils/types";
import {ReactNode, useEffect, useState} from "react";
import {toast} from "react-toastify";
import SearchContainer from "../containers/table/SearchContainer.tsx";
import ApplicantsTableContainer from "../containers/table/ApplicantsTableContainer.tsx";
import ItemPerPageSelectContainer from "../containers/table/ItemsPerPageSelectContainer.tsx";
import PaginationContainer from "../containers/table/PaginationContainer.tsx";
import "../styles/applicant-list-page.css"
import {getApplicants} from "../utils/apiFunctions.tsx";
import TableLoadingContainer from "../containers/table/loading/TableLoadingContainer.tsx";
import {applicantColumns} from "../utils/constants.tsx";
import Button from "./Button.tsx";
import {NavigateFunction, useNavigate} from "react-router-dom";

function ApplicantsListPage({ initialData, initialCurrentPage, initialItemsPerPage, initialTotalItems, initialOrderBy }: Props): ReactNode {
  const [data, setData] = useState<ApplicantInterface[]>(initialData);
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage);
  const [totalItems, setTotalItems] = useState<number>(initialTotalItems);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>(initialOrderBy);
  const navigate: NavigateFunction = useNavigate();

  useEffect((): void => {
    async function fetchData(): Promise<void> {
      setLoading(true);
      try {
        const res: {data: ApplicantInterface[], totalItems: number} = await getApplicants(currentPage, itemsPerPage, orderBy, "");

        setData(res.data);
        setTotalItems(res.totalItems);
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLoading(false);
      }
    }
    fetchData().then();
  }, [currentPage, itemsPerPage, orderBy]);

  function handleAddApplicant(): void {
    navigate("/applicants/add");
  }

  return (
    <div className="applicant-list-page">
      <span>
        <Button
          handleClick={handleAddApplicant}
          btnClasses={"applicant-list-page__back-btn"}
          isModal={true}
          modalTargetId={"#exampleModalCenter"}
          iconClass={"bi-person-add"}
          spanTextClass={"applicant-list-page__btn__text"}
          text={"Add applicant"}
        />
        <SearchContainer setData={setData} setTotalItems={setTotalItems} setLoading={setLoading} currentPage={currentPage} itemsPerPage={itemsPerPage} subUrl={"/applicant"} orderBy={orderBy}/>
      </span>
      {
        (totalItems == 0 || loading) ?
          <TableLoadingContainer columns={applicantColumns} itemsPerPage={itemsPerPage}/> :
          <>
            <ApplicantsTableContainer data={data} setOrderBy={setOrderBy} orderBy={orderBy}/>
            <div className="user-list-page__inner">
              <ItemPerPageSelectContainer itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}/>
              <PaginationContainer itemsPerPage={itemsPerPage} totalItems={totalItems} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
            </div>
          </>
      }
    </div>
  );
}

interface Props {
  initialData: ApplicantInterface[];
  initialCurrentPage: number;
  initialItemsPerPage: number;
  initialTotalItems: number;
  initialOrderBy: string;
}

export default ApplicantsListPage;
