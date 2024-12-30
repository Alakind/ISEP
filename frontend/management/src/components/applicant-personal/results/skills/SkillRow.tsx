import {SkillsInterface} from "../../../../utils/types.tsx";

function SkillRow({skillData}: Props) {
  return (
    <tr className={"skill-row"}>
      <td>{skillData.title}</td>
      <td className={"skill-row__percentage"}>{Number(skillData.scoredPoints / skillData.availablePoints * 100).toFixed(0)} %</td>
      <td className={"skill-row__points-of"}>{`${skillData.scoredPoints ?? 0} / ${skillData.availablePoints}`}</td>
      <td className={"skill-row__progress"}>
        <progress value={skillData.scoredPoints ?? 0} max={skillData.availablePoints}></progress>
      </td>
    </tr>
  )
}

interface Props {
  skillData: SkillsInterface;
}

export default SkillRow
