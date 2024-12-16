import {Selection, UserInterface} from "../utils/types";
import SearchContainer from "../containers/table/SearchContainer.tsx";
import {Dispatch, ReactNode, SetStateAction} from "react";
import PaginationContainer from "../containers/table/PaginationContainer.tsx";
import ItemPerPageSelectContainer from "../containers/table/ItemsPerPageSelectContainer.tsx";
import "../styles/user-list-page.css"
import UsersTableContainer from "../containers/table/UsersTableContainer.tsx";
import {userColumns} from "../utils/constants.tsx";
import BulkActionSelectContainer from "../containers/table/BulkActionSelectContainer.tsx";
import TableLoadingContainer from "../containers/table/loading/TableLoadingContainer.tsx";

function UsersListPage({
                         handleIsSelectedChange,
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
                         setOrderBy,
                         isSelected,
                         setIsSelected
                       }: Props): ReactNode {


  return (
    <div className="user-list-page">
      <SearchContainer setData={updateData} setTotalItems={setTotalItems} setLoading={setLoading} currentPage={currentPage} itemsPerPage={itemsPerPage} subUrl={"/user"}
                       handleIsSelectedChange={handleIsSelectedChange} orderBy={orderBy}/>
      {
        (totalItems == 0 || loading) ?
          <TableLoadingContainer columns={userColumns} itemsPerPage={itemsPerPage}/> :
          <>
            <UsersTableContainer data={data} setOrderBy={setOrderBy} setIsSelected={setIsSelected} isSelected={isSelected} orderBy={orderBy}/>
            <div className="user-list-page__inner">
              <BulkActionSelectContainer isSelected={isSelected}/>
              <ItemPerPageSelectContainer itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}/>
              <PaginationContainer itemsPerPage={itemsPerPage} totalItems={totalItems} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
            </div>
          </>
      }
    </div>
  );
}

interface Props {
  handleIsSelectedChange: (data: UserInterface[]) => void;
  data: UserInterface[];
  updateData: (data: UserInterface[]) => void;
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
  isSelected: Selection[];
  setIsSelected: Dispatch<SetStateAction<Selection[]>>;
}

export default UsersListPage;
