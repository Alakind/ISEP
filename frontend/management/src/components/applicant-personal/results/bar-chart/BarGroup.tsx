import {ReactNode} from "react";

function BarGroup({barWidth, barPadding, barColour, height}: Readonly<Props>): ReactNode {
  return (
    <rect data-testid={"bar-group"} y={`${100 - (height === 0 ? 1 : height)}%`} height={`${height === 0 ? 1 : height}%`} width={barWidth - barPadding} fill={barColour}/>
  )
}

interface Props {
  barWidth: number;
  barPadding: number;
  barColour: string;
  height: number;
}

export default BarGroup
