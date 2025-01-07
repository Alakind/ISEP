import BarGroup from "../../../../components/applicant-personal/results/bar-chart/BarGroup.tsx";
import {BarGroupInterface} from "../../../../utils/types.tsx";
import {ReactNode} from "react";

function BarGroupContainer({barGroupData, barWidth}: Readonly<Props>): ReactNode {
  const barPadding = 2
  const barColour = barGroupData.isSelected ? "var(--tertiary-color)" : "var(--text-secondary)";

  function heightScale(value: number) {
    return value * 2
  }

  const height = heightScale(Number(barGroupData.value))

  return (
    <BarGroup barWidth={barWidth} barPadding={barPadding} barColour={barColour} height={height}/>
  )
}

interface Props {
  barGroupData: BarGroupInterface;
  barWidth: number;
}

export default BarGroupContainer
