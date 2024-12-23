import AssessmentResultsViewer from "../../../components/applicant-personal/results/AssessmentResultsViewer.tsx";
import {ReactNode, useEffect, useState} from "react";
import {AssessmentInterface, SectionSolvedInterface} from "../../../utils/types.tsx";
import {getAssessment, getSectionSolution} from "../../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";

function AssessmentResultsViewerContainer({assessmentId, inviteUuid}: Props): ReactNode {
  const [assessmentData, setAssessmentData] = useState<AssessmentInterface>();
  const [sectionsData, setSectionsData] = useState<SectionSolvedInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<number>(0);

  useEffect((): void => {
    if (assessmentId != "0") {
      getData().then();
    }
  }, [assessmentId])


  async function getData(): Promise<void> {
    setLoading(true);
    try {
      const data: AssessmentInterface = await getAssessment(assessmentId);
      setAssessmentData(data);

      const retrievedSections: SectionSolvedInterface[] = await Promise.all(
        data.sections.map((sectionId: number): Promise<SectionSolvedInterface> => getSectionSolution(`${sectionId}`, inviteUuid))
      );
      setSectionsData(retrievedSections);
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
        loading || assessmentData == undefined ?
          <></> :
          <AssessmentResultsViewer assessmentData={assessmentData} loading={loading} sectionsData={sectionsData} activeSection={activeSection} setActiveSection={setActiveSection}
                                   inviteUuid={inviteUuid}/>
      }
    </>
  )
}

interface Props {
  assessmentId: string;
  inviteUuid: string;
}

export default AssessmentResultsViewerContainer
