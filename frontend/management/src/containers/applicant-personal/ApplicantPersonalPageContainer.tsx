import {NavigateFunction, useNavigate, useParams} from "react-router-dom";
import {ApplicantInterface, AssessmentInterface, InviteInterface} from "../../utils/types.tsx";
import ApplicantPersonalPage from "../../components/applicant-personal/ApplicantPersonalPage.tsx";
import {ReactNode, useEffect, useState} from "react";
import {getApplicant, getAssessment, getInvite} from "../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import LoadingPage from "../../components/LoadingPage.tsx";
import CardPageContainer from "../card/CardPageContainer.tsx";
import {Roles} from "../../utils/constants.tsx";
import {useUserData} from "../../utils/msal/UseUserData.tsx";
import PageNoAccess from "../PageNoAccess.tsx";

function ApplicantPersonalPageContainer(): ReactNode {
  const [applicantData, setApplicantData] = useState<ApplicantInterface>({
    id: "0",
    name: "",
    email: "",
    statuses: [],
    preferredLanguage: "",
    scores: [],
    createdAt: new Date(),
    invites: []
  });
  const [invitesData, setInvitesData] = useState<InviteInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();
  const {id} = useParams();
  const [assessmentsData, setAssessmentsData] = useState<AssessmentInterface[]>([]);
  const user = useUserData();

  useEffect((): void => {
    if (id) {
      if (user.role === Roles.ADMIN || user.role === Roles.RECRUITER || user.role === Roles.INTERVIEWER) {
        fetchApplicantData().then();
      }
    }
  }, [id, user.role]);

  async function fetchApplicantData(): Promise<void> {
    setLoading(true);
    try {
      if (id) {
        const applicant: ApplicantInterface = await getApplicant(id);
        setApplicantData(applicant);

        if (applicant.invites?.length) {
          const invitePromises: Promise<InviteInterface | null>[] = applicant.invites.map((inviteId: string): Promise<InviteInterface | null> =>
            getInvite(inviteId).catch((): null => {
              toast.error(`Failed to fetch invite ${inviteId}:`);
              return null;
            })
          );

          const invites: InviteInterface[] = (await Promise.all(invitePromises)).filter((invite: InviteInterface | null): invite is InviteInterface => invite !== null);
          setInvitesData(invites);

          const assessments: AssessmentInterface[] = []
          for (const element of invites) {
            const data: AssessmentInterface = await getAssessment(element.assessmentId);
            assessments.push(data);
          }

          setAssessmentsData(assessments);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error occurred.");
      }
      navigate(`/applicants`);
    } finally {
      setLoading(false);
    }
  }

  function goToApplicantsPage(): void {
    navigate(`/applicants`);
  }

  if (user.role === Roles.ADMIN || user.role === Roles.RECRUITER || user.role === Roles.INTERVIEWER) {
    return loading || applicantData.id === "0" || (invitesData.length !== applicantData.invites?.length) || (invitesData.length !== 0 && assessmentsData.length === 0) ? (
      <LoadingPage/>
    ) : (
      <CardPageContainer>
        <ApplicantPersonalPage
          applicant={applicantData}
          setApplicant={setApplicantData}
          goToApplicantsPage={goToApplicantsPage}
          invitesData={invitesData}
          assessmentsData={assessmentsData}
          setInvitesData={setInvitesData}
        />
      </CardPageContainer>
    );
  } else {
    return <PageNoAccess/>
  }
}

export default ApplicantPersonalPageContainer;
