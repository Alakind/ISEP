import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {ScoredAssessmentInterface, SkillsInterface} from "../../../../utils/types.tsx";
import {toast} from "react-toastify";
import LoadingPage from "../../../../components/LoadingPage.tsx";
import {getSkillsStats} from "../../../../utils/apiFunctions.tsx";
import SkillRow from "../../../../components/applicant-personal/results/skills/SkillRow.tsx";
import "../../../../styles/skills-block.css";

function SkillsBlockContainer({assessmentId, inviteId, setAssessmentScore}: Props) {
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
      for (let i: number = 0; i < data.length; i++) {
        scoredAssessment.scoredPoints += data[i].scoredPoints;
        scoredAssessment.availablePoints += data[i].availablePoints;
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
      <table>
        <tbody>
        {
          skillsData.map((skillData, index) => (
            <SkillRow key={index} skillData={skillData}/>
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
