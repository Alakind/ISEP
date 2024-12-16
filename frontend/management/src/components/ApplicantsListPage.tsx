import {ApplicantInterface} from "../utils/types";
import {Dispatch, ReactNode, SetStateAction} from "react";
import SearchContainer from "../containers/table/SearchContainer.tsx";
import ApplicantsTableContainer from "../containers/table/ApplicantsTableContainer.tsx";
import ItemPerPageSelectContainer from "../containers/table/ItemsPerPageSelectContainer.tsx";
import PaginationContainer from "../containers/table/PaginationContainer.tsx";
import "../styles/applicant-list-page.css"
import TableLoadingContainer from "../containers/table/loading/TableLoadingContainer.tsx";
import {applicantColumns} from "../utils/constants.tsx";
import Button from "./Button.tsx";

function ApplicantsListPage({
                              handleAddApplicant,
                              data,
                              updateData,
                              totalItems,
                              setTotalItems,
                              loading,
                              setLoading,
                              currentPage,
                              setCurrentPage,
                              itemsPerPage,
                              setItemsPerPage,
                              orderBy,
                              setOrderBy
                            }: Props): ReactNode {
  return (
    <div className="applicant-list-page">
      <span>
        <Button
          handleClick={handleAddApplicant}
          isModal={true}
          modalTargetId={"#exampleModalCenter"}
          iconClass={"bi-person-add"}
          spanTextClass={"applicant-list-page__btn__text"}
          text={"Add applicant"}
        />
        <SearchContainer setData={updateData} setTotalItems={setTotalItems} setLoading={setLoading} currentPage={currentPage} itemsPerPage={itemsPerPage} subUrl={"/applicant"} orderBy={orderBy}/>
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
  handleAddApplicant: () => void;
  data: ApplicantInterface[];
  updateData: (data: ApplicantInterface[]) => void;
  totalItems: number;
  setTotalItems: Dispatch<SetStateAction<number>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: Dispatch<SetStateAction<number>>;
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
}

export default ApplicantsListPage;
