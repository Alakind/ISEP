import {BarChartInterface, BarGroupInterface} from "../../../../utils/types.tsx";
import {ReactNode} from "react";
import BarGroupContainer from "../../../../containers/applicant-personal/results/bar-chart/BarGroupContainer.tsx";
import "../../../../styles/bar-chart.css";


function BarChart({barChartData, barWidth}: Props): ReactNode {
  return (
    <>
      <div className={"bar-chart__container"}>
        <svg width="200" height="100%">
          <g>
            {
              barChartData.barGroups.map((barGroupData: BarGroupInterface, index: number): ReactNode => {
                return (
                  <g key={index} transform={`translate(${index * barWidth}, 0)`}>
                    <BarGroupContainer barGroupData={barGroupData} barWidth={barWidth}/>
                  </g>
                )
              })
            }
          </g>
        </svg>
      </div>
      <div className={"bar-chart__text"}>Better than <span>{barChartData.percentage}</span>% of other applicants</div>
    </>
  )
}

interface Props {
  barChartData: BarChartInterface;
  barWidth: number;
}

export default BarChart
