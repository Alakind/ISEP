import AssessmentResultsViewer from "../components/applicant-personal/AssessmentResultsViewer.tsx";

function AssessmentResultsViewerContainer({}: Props) {

  //TODO retrieve results

  return (
    <>
      <h4>Results</h4>
      <AssessmentResultsViewer/>
    </>
  )
}

interface Props {

}

export default AssessmentResultsViewerContainer
