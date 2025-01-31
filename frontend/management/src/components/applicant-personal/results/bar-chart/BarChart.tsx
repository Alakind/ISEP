import {BarChartInterface} from "../../../../utils/types.tsx";
import {ReactNode} from "react";
import BarGroupContainer from "../../../../containers/applicant-personal/results/bar-chart/BarGroupContainer.tsx";
import "../../../../styles/bar-chart.css";


function BarChart({barChartData, barWidth}: Readonly<Props>): ReactNode {
  return (
    <>
      <div className={"bar-chart__container"} data-testid={"bar-chart-container"}>
        <svg width="200" height="100">
          {
            barChartData.distributionGroups.map((percentage: number, index: number): ReactNode => {
              return (
                <g key={index + "_" + percentage} transform={`translate(${index * barWidth}, 0)`}>
                  <BarGroupContainer selectedGroup={barChartData.selectedGroup} percentage={percentage} barWidth={barWidth} index={index}/>
                </g>
              )
            })
          }
        </svg>
      </div>
      <div className={"bar-chart__text"} data-testid={"bar-chart-text"}>Better than <span>{barChartData.percentage.toFixed(2)}</span>% of other applicants</div>
    </>
  )
}

interface Props {
  barChartData: BarChartInterface;
  barWidth: number;
}

export default BarChart
