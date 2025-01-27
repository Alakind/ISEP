import BarGroup from "../../../../components/applicant-personal/results/bar-chart/BarGroup.tsx";
import {ReactNode} from "react";

function BarGroupContainer({selectedGroup, index, percentage, barWidth}: Readonly<Props>): ReactNode {
  const barPadding = 2
  const barColour = selectedGroup === index ? "var(--tertiary-color)" : "#b2b9c2";

  function heightScale(value: number) {
    return value * 2
  }

  const height = heightScale(percentage)

  return (
    <BarGroup barWidth={barWidth} barPadding={barPadding} barColour={barColour} height={height}/>
  )
}

interface Props {
  selectedGroup: number;
  index: number;
  percentage: number;
  barWidth: number;
}

export default BarGroupContainer
