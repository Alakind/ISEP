import AssessmentResultsViewer from "../../../components/applicant-personal/results/AssessmentResultsViewer.tsx";
import {ReactNode, useEffect, useState} from "react";
import {AssessmentInterface, InviteInterface, SectionSolvedInterface} from "../../../utils/types.tsx";
import {getSectionResult} from "../../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";

function AssessmentResultsViewerContainer({invitesData, assessmentsData}: Props): ReactNode {
  const [sectionsData, setSectionsData] = useState<SectionSolvedInterface[][]>([]);
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
      const sections: SectionSolvedInterface[][] = []
      for (let i: number = 0; i < assessmentsData.length; i++) {
        const retrievedSections: SectionSolvedInterface[] = await Promise.all(
          assessmentsData[i].sections.map((sectionId: number): Promise<SectionSolvedInterface> => getSectionResult(`${sectionId}`, invitesData[i].id))
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
                                   activeAssessment={activeAssessment} setActiveAssessment={setActiveAssessment} invitesData={invitesData}/>
      }
    </>
  )
}

interface Props {
  invitesData: InviteInterface[];
  assessmentsData: AssessmentInterface[];
}

export default AssessmentResultsViewerContainer
