import {ApplicantInterface, AssessmentInterface, InviteInterface} from "../../utils/types.tsx";
import InvitesOverview from "../../components/applicant-personal/InvitesOverview.tsx";
import {ChangeEvent, Dispatch, MouseEvent, ReactNode, SetStateAction, useState} from "react";
import {toast} from "react-toastify";
import CustomWarnToast from "../../components/CustomWarnToast.tsx";
import {EmailTypes, InviteStatuses} from "../../utils/constants.tsx";
import {deleteInvite, sendMail, updateInvite} from "../../utils/apiFunctions.tsx";
import {mapStatus} from "../../utils/mapping.tsx";
import {canCancelInvite, getDateFormatted} from "../../utils/general.tsx";

function InvitesOverviewContainer({invitesData, setInvitesData, assessmentsData, applicant, setApplicant}: Readonly<Props>): ReactNode {
  const [expirationDates, setExpirationDates] = useState<string[]>(
    invitesData.map((invite: InviteInterface): string => getDateFormatted(invite.expiresAt))
  );

  async function handleChangeExpirationDate(e: ChangeEvent<HTMLInputElement>, index: number): Promise<void> {
    const {value} = e.target;
    const selectedDate: number = new Date(value).setHours(0, 0, 0, 0);
    const todayDate: number = new Date().setHours(0, 0, 0, 0);

    if (todayDate > selectedDate) {
      toast.error("You can't select a date in the past!");
      return;
    }

    setExpirationDates((prev: string[]): string[] => {
      const updatedDates: string[] = [...prev];
      updatedDates[index] = value;
      return updatedDates;
    });

    const isoDate: string = new Date(value).toISOString();
    await updateInvite(invitesData[index].id, {expiresAt: isoDate})
  }

  function findInvite(id: string): InviteInterface {
    const invite = invitesData.find(invite => invite.id === id);
    if (invite === undefined) {
      toast.error("Invite not found.");
      throw new Error("Invite not found.");
    }
    return invite;
  }

  async function handleCancel(e: MouseEvent<HTMLButtonElement>, id: string): Promise<void> {
    e.preventDefault();

    const invite: InviteInterface = findInvite(id);

    if (canCancelInvite(mapStatus(invite.status))) {
      await changeStatus(id, InviteStatuses.CANCELLED);
      toast.success("Successfully cancelled invite");
    } else {
      toast.warn("Invite can't be cancelled.");
    }
  }

  async function handleDelete(e: MouseEvent<HTMLButtonElement>, id: string): Promise<void> {
    e.preventDefault();

    const invite: InviteInterface = findInvite(id);

    if (mapStatus(invite.status) === (InviteStatuses.APP_STARTED || InviteStatuses.APP_FINISHED)) {
      toast.error("Invite couldn't be deleted because the assessment has been started or finished.");
    }

    toast.warn(
      <CustomWarnToast
        proceedAction={async (): Promise<void> => await proceedHandleDelete(id)}
        cancelAction={cancelHandleDelete}
        message={"Are you sure you want to delete this invite? The invite can't be restored!"}
      />,
      {hideProgressBar: true, autoClose: false,}
    );
  }

  async function handleRemind(e: MouseEvent<HTMLButtonElement>, id: string): Promise<void> {
    e.preventDefault();

    const invite: InviteInterface = findInvite(id);

    try {
      if (mapStatus(invite.status) !== (InviteStatuses.APP_REMINDED_ONCE)) {
        await changeStatus(id, InviteStatuses.APP_REMINDED_ONCE);
        await sendMail(applicant.id, invite.id, EmailTypes.REMINDER);
      } else if (mapStatus(invite.status) === (InviteStatuses.APP_REMINDED_ONCE)) {
        await changeStatus(id, InviteStatuses.APP_REMINDED_TWICE);
        await sendMail(applicant.id, invite.id, EmailTypes.REMINDER);
      } else {
        toast.error("Limit of reminders has been reached!");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Unknown error occurred.");
      }
    } finally {
      toast.success("Successfully emailed reminder.");
    }
  }


  async function changeStatus(id: string, newStatus: (typeof InviteStatuses)[keyof typeof InviteStatuses]): Promise<void> {
    try {
      const res: { data: Partial<InviteInterface> } = await updateInvite(id, {status: mapStatus(newStatus)});

      setInvitesData((prev: InviteInterface[]): InviteInterface[] =>
        prev.map((invite: InviteInterface): InviteInterface =>
          invite.id === id && res.data.status !== undefined
            ? {...invite, status: mapStatus(res.data.status)}
            : invite
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Unknown error occurred.");
      }
    }
  }

  async function proceedHandleDelete(id: string): Promise<void> {
    try {
      const res: string = await deleteInvite(id);

      const updatedInvitesData = invitesData.filter(invite => invite.id !== id);
      setInvitesData(updatedInvitesData);

      setApplicant((prev: ApplicantInterface): ApplicantInterface => {
        const updatedInvites = prev.invites?.filter(invite => invite !== id);

        return {
          ...prev,
          invites: updatedInvites,
        };
      });
      toast.success(res);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Unknown error occurred.");
      }
    }
  }

  function cancelHandleDelete(): void {
    toast.info("Invite hasn't been deleted!")
  }

  return (
    <InvitesOverview
      invitesData={invitesData}
      assessmentsData={assessmentsData}
      handleChangeExpirationDate={handleChangeExpirationDate}
      expirationDates={expirationDates}
      handleCancel={handleCancel}
      handleDelete={handleDelete}
      handleRemind={handleRemind}
    />
  )
}

interface Props {
  invitesData: InviteInterface[];
  setInvitesData: Dispatch<SetStateAction<InviteInterface[]>>;
  assessmentsData: AssessmentInterface[];
  applicant: ApplicantInterface;
  setApplicant: Dispatch<SetStateAction<ApplicantInterface>>;
}

export default InvitesOverviewContainer
