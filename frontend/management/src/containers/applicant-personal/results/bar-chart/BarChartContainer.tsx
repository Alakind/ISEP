import BarChart from "../../../../components/applicant-personal/results/bar-chart/BarChart.tsx";
import {ReactNode, useEffect, useState} from "react";
import {toast} from "react-toastify";
import LoadingPage from "../../../../components/LoadingPage.tsx";
import {BarChartInterface} from "../../../../utils/types.tsx";
import {getBarChartStats} from "../../../../utils/apiFunctions.tsx";

function BarChartContainer({inviteUuid}: Props): ReactNode {
  const [loading, setLoading] = useState<boolean>(false);
  const [barChartData, setBarChartData] = useState<BarChartInterface>({percentage: "-", barGroups: []});

  useEffect((): void => {
    if (inviteUuid != "") {
      getData().then();
    }
  }, [inviteUuid])


  async function getData(): Promise<void> {
    setLoading(true);
    try {
      const data: BarChartInterface = await getBarChartStats(inviteUuid);
      setBarChartData(data);
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
      <BarChart barChartData={barChartData} barWidth={20}/>
    )
  }
}

interface Props {
  inviteUuid: string;
}

export default BarChartContainer
