import "../../styles/dashboard.css";
import TableLoadingContainer from "../../containers/table/loading/TableLoadingContainer.tsx";
import ApplicantsTableContainer from "../../containers/table/ApplicantsTableContainer.tsx";
import ItemPerPageSelectContainer from "../../containers/table/ItemsPerPageSelectContainer.tsx";
import PaginationContainer from "../../containers/table/PaginationContainer.tsx";
import {ApplicantInterface} from "../../utils/types.tsx";
import {Dispatch, ReactNode, SetStateAction} from "react";
import {dashboardColumns} from "../../utils/constants.tsx";

function DashboardList({
                         data,
                         totalItems,
                         loading,
                         currentPage,
                         setCurrentPage,
                         itemsPerPage,
                         setItemsPerPage,
                         orderBy,
                         setOrderBy
                       }: Readonly<Props>): ReactNode {
  return (
    <div>
      {
        (totalItems == 0 || loading) ?
          <TableLoadingContainer columns={dashboardColumns} itemsPerPage={itemsPerPage}/> :
          <>
            <ApplicantsTableContainer data={data} setOrderBy={setOrderBy} orderBy={orderBy}/>
            <div className="user-list-page__inner">
              <ItemPerPageSelectContainer itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}/>
              <PaginationContainer itemsPerPage={itemsPerPage} totalItems={totalItems} setCurrentPage={setCurrentPage}
                                   currentPage={currentPage}/>
            </div>
          </>
      }
    </div>
  )
}

interface Props {
  data: ApplicantInterface[];
  totalItems: number;
  loading: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: Dispatch<SetStateAction<number>>;
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
}

export default DashboardList
