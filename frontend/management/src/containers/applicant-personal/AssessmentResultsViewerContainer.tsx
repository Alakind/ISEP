import AssessmentResultsViewer from "../../components/applicant-personal/AssessmentResultsViewer.tsx";
import {ReactNode, useEffect, useState} from "react";
import {AssessmentInterface, SectionInterface} from "../../utils/types.tsx";
import {getAssessment, getSectionSolution} from "../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";

function AssessmentResultsViewerContainer({assessmentId, inviteUuid}: Props): ReactNode {
  const [assessmentData, setAssessmentData] = useState<AssessmentInterface>();
  const [sectionsData, setSectionsData] = useState<SectionInterface[]>([]);
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

      const retrievedSections: SectionInterface[] = await Promise.all(
        data.sections.map((sectionId: number): Promise<SectionInterface> => getSectionSolution(`${sectionId}`, inviteUuid))
      );
      setSectionsData(retrievedSections);
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AssessmentResultsViewer sectionsData={sectionsData} activeSection={activeSection} setActiveSection={setActiveSection} />
    </>
  )
}

interface Props {
  assessmentId: string;
  inviteUuid: string;
}

export default AssessmentResultsViewerContainer
