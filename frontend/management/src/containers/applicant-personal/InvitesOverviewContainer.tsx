import {AssessmentInterface, InviteInterface} from "../../utils/types.tsx";
import InvitesOverview from "../../components/applicant-personal/InvitesOverview.tsx";
import {ChangeEvent, ReactNode, useState} from "react";
import {toast} from "react-toastify";

function InvitesOverviewContainer({invitesData, assessmentsData}: Readonly<Props>): ReactNode {
  const [expirationDates, setExpirationDates] = useState<string[]>(
    invitesData.map((invite: InviteInterface): string => getDateFormatted(invite.expiresAt))
  );

  //TODO remove this when inviteData excepts expirationDate

  function handleChangeExpirationDate(e: ChangeEvent<HTMLInputElement>, index: number): void {
    const selectedDate: number = new Date(e.target.value).setHours(0, 0, 0, 0);
    const currentDate: number = new Date(invitesData[index].expiresAt).setHours(0, 0, 0, 0); //TODO make more robust because this will break by setting a new date the date can't be set to a
    // earlier date with the input min value.

    if (currentDate > selectedDate) {
      toast.error("Select current expiration date or a date in the future.");
      return;
    }

    setExpirationDates((prev: string[]): string[] => {
      const updatedDates: string[] = [...prev];
      updatedDates[index] = e.target.value;
      return updatedDates;
    });

    // TODO: update via invites data
    // setInviteData((prev: InviteInterface[]): InviteInterface[] => {
    //   const updatedInvites = [...prev];
    //   updatedInvites[index].expiresAt = e.target.value;
    //   return updatedInvites;
    // });
  }

  function getDateFormatted(inputDate: string): string {
    const date: Date = new Date(inputDate);

    const yyyy: number = date.getFullYear();
    const mm: string = String(date.getMonth() + 1).padStart(2, '0');
    const dd: string = String(date.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  return (
    <InvitesOverview invitesData={invitesData} assessmentsData={assessmentsData} handleChangeExpirationDate={handleChangeExpirationDate} expirationDates={expirationDates}/>
  )
}

interface Props {
  invitesData: InviteInterface[];
  assessmentsData: AssessmentInterface[];
}

export default InvitesOverviewContainer
