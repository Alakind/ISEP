import AssessmentResultsViewer from "../../components/applicant-personal/AssessmentResultsViewer.tsx";
import {useEffect, useState} from "react";
import {AssessmentInterface, SectionInterface} from "../../utils/types.tsx";
import {getAssessment, getSection} from "../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";

function AssessmentResultsViewerContainer({assessmentId}: Props) {
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
      const data1 = await getAssessment(assessmentId);
      setAssessmentData(data1);

      const retrievedSections = await Promise.all(
        data1.sections.map((sectionId) => getSection(`${sectionId}`))
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
}

export default AssessmentResultsViewerContainer
