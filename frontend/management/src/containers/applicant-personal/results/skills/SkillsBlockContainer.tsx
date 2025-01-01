import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {ScoredAssessmentInterface, SkillsInterface} from "../../../../utils/types.tsx";
import {toast} from "react-toastify";
import LoadingPage from "../../../../components/LoadingPage.tsx";
import {getSkillsStats} from "../../../../utils/apiFunctions.tsx";
import SkillRow from "../../../../components/applicant-personal/results/skills/SkillRow.tsx";
import "../../../../styles/skills-block.css";

function SkillsBlockContainer({assessmentId, inviteId, setAssessmentScore}: Readonly<Props>) {
  const [loading, setLoading] = useState<boolean>(false);
  const [skillsData, setSkillsData] = useState<SkillsInterface[]>([]);

  useEffect((): void => {
    if (inviteId != "") {
      getData().then();
    }
  }, [inviteId])


  async function getData(): Promise<void> {
    setLoading(true);
    try {
      const data: SkillsInterface[] = await getSkillsStats(assessmentId, inviteId);
      setSkillsData(data);

      const scoredAssessment: ScoredAssessmentInterface = {availablePoints: 0, scoredPoints: 0};
      for (const element of data) {
        if (!scoredAssessment.scoredPoints) {
          scoredAssessment.scoredPoints = 0;
        }
        scoredAssessment.scoredPoints += (element.scoredPoints ?? 0);
        scoredAssessment.availablePoints += element.availablePoints;
      }
      setAssessmentScore(scoredAssessment)
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

  if (loading) {
    return (
      <LoadingPage additionalClasses={"page--barchart"} size={30}/>
    )

  } else {
    return (
      <table data-testid={"skills-container"}>
        <tbody>
        {
          skillsData.map((skillData, index) => (
            <SkillRow key={"skill-row-" + index} skillData={skillData}/>
          ))
        }
        </tbody>
      </table>
    )
  }
}

interface Props {
  assessmentId: string;
  inviteId: string;
  setAssessmentScore: Dispatch<SetStateAction<ScoredAssessmentInterface>>;
}

export default SkillsBlockContainer
