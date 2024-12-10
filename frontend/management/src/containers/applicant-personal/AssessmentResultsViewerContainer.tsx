import AssessmentResultsViewer from "../../components/applicant-personal/AssessmentResultsViewer.tsx";
import {useEffect, useState} from "react";
import {AssessmentInterface, SectionInterface} from "../../utils/types.tsx";
import {getAssessment, getSection, getSectionSolution} from "../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";

function AssessmentResultsViewerContainer({assessmentId, inviteUuid}: Props) {
  const [assessmentData, setAssessmentData] = useState<AssessmentInterface>();
  const [sectionsData, setSectionsData] = useState<SectionInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<number>(0);

  useEffect(() => {
    if (assessmentId != "0") {
      getData()
    }
  }, [assessmentId])


  async function getData() {
    setLoading(true);
    try {
      const data = await getAssessment(assessmentId);
      setAssessmentData(data);

      const retrievedSections = await Promise.all(
        data.sections.map((sectionId) => getSectionSolution(`${sectionId}`, inviteUuid))
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
