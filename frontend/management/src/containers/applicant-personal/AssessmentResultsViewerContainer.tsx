import AssessmentResultsViewer from "../../components/applicant-personal/AssessmentResultsViewer.tsx";
import {ReactNode, useEffect, useState} from "react";
import {AssessmentInterface, InviteInterface, SectionInterface} from "../../utils/types.tsx";
import {getSectionSolution} from "../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";

function AssessmentResultsViewerContainer({invitesData, inviteUuids, assessmentsData}: Props): ReactNode {
  const [sectionsData, setSectionsData] = useState<SectionInterface[][]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [activeAssessment, setActiveAssessment] = useState<number>(0);

  useEffect((): void => {
    if (invitesData.length != 0 && assessmentsData.length != 0) {
      getData().then();
    }
  }, [invitesData, assessmentsData]);


  async function getData(): Promise<void> {
    setLoading(true);
    try {
      const sections: SectionInterface[][] = []
      for (let i: number = 0; i < assessmentsData.length; i++) {
        const retrievedSections: SectionInterface[] = await Promise.all(
          assessmentsData[i].sections.map((sectionId: number): Promise<SectionInterface> => getSectionSolution(`${sectionId}`, inviteUuids[i]))
        );
        sections.push(retrievedSections);
      }

      setSectionsData(sections);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {
        loading || assessmentsData == undefined || assessmentsData.length == 0 || sectionsData.length == 0 ?
          <></> :
          <AssessmentResultsViewer assessmentsData={assessmentsData} loading={loading} sectionsData={sectionsData} activeSection={activeSection} setActiveSection={setActiveSection}
                                   activeAssessment={activeAssessment} setActiveAssessment={setActiveAssessment}/>
      }
    </>
  )
}

interface Props {
  invitesData: InviteInterface[];
  inviteUuids: string[];
  assessmentsData: AssessmentInterface[];
}

export default AssessmentResultsViewerContainer
