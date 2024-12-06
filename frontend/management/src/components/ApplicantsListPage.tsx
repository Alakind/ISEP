import {ApplicantInterface} from "../utils/types";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import SearchContainer from "../containers/SearchContainer.tsx";
import ApplicantsTableContainer from "../containers/ApplicantsTableContainer.tsx";
import ItemPerPageSelectContainer from "../containers/ItemsPerPageSelectContainer.tsx";
import PaginationContainer from "../containers/PaginationContainer.tsx";
import "../styles/applicant-list-page.css"
import {getApplicants} from "../utils/apiFunctions.tsx";

function ApplicantsListPage({ initialData, initialCurrentPage, initialItemsPerPage, initialTotalItems, initialOrderBy }: Props) {
  const [data, setData] = useState<ApplicantInterface[]>(initialData);
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage);
  const [totalItems, setTotalItems] = useState<number>(initialTotalItems);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>(initialOrderBy);

  useEffect(() => {
    const fetchData = async() => {
      setLoading(true);
      try {
        const res = await getApplicants(currentPage, itemsPerPage, orderBy, "");

        /*const res = {
          data: [
            {
              name: "Sasha Surname",
              id: "1234567890",
              email: "Sasha@email.com",
              score: 100,
              status: ApplicantStatuses.APP_ASSESSMENT_IN_PROGRESS,
              preferredLanguage: PreferredLanguages.SQL,
            },
            {
              name: "Everard Surname",
              id: "234567890",
              email: "Everard@email.com",
              score: 90,
              status: ApplicantStatuses.APP_FINISHED,
              preferredLanguage: PreferredLanguages.SQL,
            },
            {
              name: "Jesse Surname",
              id: "34567890",
              email: "Jesse@email.com",
              score: 80,
              status: ApplicantStatuses.APP_INVITED_ASSESSMENT,
              preferredLanguage: PreferredLanguages.SQL,
            },
            {
              name: "Ruben Surname",
              id: "4567890",
              email: "Ruben@email.com",
              score: 70,
              status: ApplicantStatuses.ASSESSMENT_EXPIRED,
              preferredLanguage: PreferredLanguages.SQL,
            },
            {
              name: "Jarno Surname",
              id: "567890",
              email: "Jarno@email.com",
              score: 60,
              status: ApplicantStatuses.CANCELLED,
              preferredLanguage: PreferredLanguages.SQL,
            },
          ],
          totalItems: 90
        }*/
        setData(res.data);
        setTotalItems(res.totalItems);
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage, itemsPerPage, orderBy]);

  return (
    <div className="applicant-list-page">
      <SearchContainer<ApplicantInterface> setData={setData} setTotalItems={setTotalItems} setLoading={setLoading} currentPage={currentPage} itemsPerPage={itemsPerPage} subUrl={"/applicant"} />
      {
        loading ?
          <p>Loading...</p> : //TODO implement temp table
          <>
            <ApplicantsTableContainer data={data} setOrderBy={setOrderBy}/>
            <div className="user-list-page__inner">
              <ItemPerPageSelectContainer itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} />
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
