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
                              totalItems,
                              loading,
                              currentPage,
                              setCurrentPage,
                              itemsPerPage,
                              setItemsPerPage,
                              orderBy,
                              setOrderBy,
                              setQuery
                            }: Readonly<Props>): ReactNode {
  return (
    <div className="applicant-list-page" data-testid={"applicants-list-page"}>
      <span>
        <Button
          handleClick={handleAddApplicant}
          iconClass={"bi-person-add"}
          spanTextClass={"applicant-list-page__btn__text"}
          text={"Add applicant"}
        />
        <SearchContainer setQuery={setQuery}/>
      </span>
      {
        (totalItems == 0 || loading) ?
          <TableLoadingContainer columns={applicantColumns} itemsPerPage={itemsPerPage}/> :
          <>
            <ApplicantsTableContainer data={data} setOrderBy={setOrderBy} orderBy={orderBy}/>
            <div className="applicant-list-page__inner">
              <ItemPerPageSelectContainer itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}/>
              <PaginationContainer itemsPerPage={itemsPerPage} totalItems={totalItems} setCurrentPage={setCurrentPage}
                                   currentPage={currentPage}/>
            </div>
          </>
      }
    </div>
  );
}

interface Props {
  handleAddApplicant: () => void;
  data: ApplicantInterface[];
  totalItems: number;
  loading: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: Dispatch<SetStateAction<number>>;
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
  setQuery: Dispatch<SetStateAction<string>>;
}

export default ApplicantsListPage;
