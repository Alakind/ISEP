import "../../styles/dashboard.css";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {ApplicantInterface, InviteInterface} from "../../utils/types.tsx";
import {getApplicants, getInvites} from "../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import {InviteDateAttributes, InviteStatuses} from "../../utils/constants.tsx";
import {formatDate} from "../../utils/general.tsx";
import {mapStatus} from "../../utils/mapping.tsx";
import DashboardList from "../../components/dashboard/DashboardList.tsx";

function DashboardListContainer({setTotalApplicants, setTotalWillExpire, setTotalExpired}: Readonly<Props>) {
  const [dataApplicants, setDataApplicants] = useState<ApplicantInterface[]>([]);
  const [dataFinished, setDataFinished] = useState<InviteInterface[]>([]);
  const [dataExpired, setDataExpired] = useState<InviteInterface[]>([]);
  const [dataWillExpire, setDataWillExpire] = useState<InviteInterface[]>([]);

  useEffect((): void => {
    async function fetchData(): Promise<void> {
      try {
        const applicantsResponse: { data: ApplicantInterface[], totalItems: number } = await getApplicants(0, -1, "", "");

        const today = new Date();
        const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const sevenDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        const comingTwoDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);

        const invitesFinished: {
          data: InviteInterface[],
          totalItems: number
        } = await getInvites(mapStatus(InviteStatuses.APP_FINISHED), InviteDateAttributes.ASSESSMENT_FINISHED_AT, formatDate(sevenDaysAgo), undefined, "assessmentFinishedAt,desc");
        const invitesExpired: {
          data: InviteInterface[],
          totalItems: number
        } = await getInvites(mapStatus(InviteStatuses.EXPIRED));
        const invitesWillExpire: {
          data: InviteInterface[],
          totalItems: number
        } = await getInvites(undefined, InviteDateAttributes.EXPIRES_AT, formatDate(tomorrow), formatDate(comingTwoDays));
        setTotalApplicants(applicantsResponse.totalItems);
        setTotalWillExpire(invitesWillExpire.totalItems)
        setTotalExpired(invitesExpired.totalItems)
        setDataApplicants(applicantsResponse.data);
        setDataFinished(invitesFinished.data);
        setDataExpired(invitesExpired.data);
        setDataWillExpire(invitesWillExpire.data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error("Unknown error occurred.");
        }
      }
    }

    fetchData().then();
  }, [setTotalApplicants, setTotalExpired, setTotalWillExpire]);

  return (
    <DashboardList
      dataApplicants={dataApplicants}
      dataFinished={dataFinished}
      dataExpired={dataExpired}
      dataWillExpire={dataWillExpire}
    />
  )
}

interface Props {
  setTotalApplicants: Dispatch<SetStateAction<number>>;
  setTotalWillExpire: Dispatch<SetStateAction<number>>;
  setTotalExpired: Dispatch<SetStateAction<number>>;
}

export default DashboardListContainer
