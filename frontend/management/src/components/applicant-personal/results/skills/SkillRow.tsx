import {SkillsInterface} from "../../../../utils/types.tsx";

function SkillRow({skillData}: Props) {
  return (
    <tr className={"skill-row"}>
      <td>{skillData.name}</td>
      <td className={"skill-row__percentage"}>{Number(skillData.scoredPoints / skillData.totalPoints * 100).toFixed(0)} %</td>
      <td className={"skill-row__points-of"}>{`${skillData.scoredPoints} / ${skillData.totalPoints}`}</td>
      <td className={"skill-row__progress"}>
        <progress value={skillData.scoredPoints} max={skillData.totalPoints}></progress>
      </td>
    </tr>
  )
}

interface Props {
  skillData: SkillsInterface;
}

export default SkillRow
