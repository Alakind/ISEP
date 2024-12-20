import {ReactNode} from "react";

function BarGroup({barWidth, barPadding, barColour, height}: Props): ReactNode {
  return (
    <rect y={`${100 - height}%`} height={`${height}%`} width={barWidth - barPadding} fill={barColour}/>
  )
}

interface Props {
  barWidth: number;
  barPadding: number;
  barColour: string;
  height: number;
}

export default BarGroup
