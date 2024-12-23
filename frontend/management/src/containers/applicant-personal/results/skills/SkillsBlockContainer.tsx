import {useEffect, useState} from "react";
import {SkillsInterface} from "../../../../utils/types.tsx";
import {toast} from "react-toastify";
import LoadingPage from "../../../../components/LoadingPage.tsx";
import {getSkillsStats} from "../../../../utils/apiFunctions.tsx";
import SkillRow from "../../../../components/applicant-personal/results/skills/SkillRow.tsx";
import "../../../../styles/skills-block.css";

function SkillsBlockContainer({inviteUuid}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [skillsData, setSkillsData] = useState<SkillsInterface[]>([]);

  useEffect((): void => {
    if (inviteUuid != "") {
      getData().then();
    }
  }, [inviteUuid])


  async function getData(): Promise<void> {
    setLoading(true);
    try {
      const data: SkillsInterface[] = await getSkillsStats(inviteUuid);
      setSkillsData(data);
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
  inviteUuid: string;
}

export default SkillsBlockContainer
