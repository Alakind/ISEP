import DashboardStatistics from "../../components/dashboard/DashboardStatistics.tsx";

function DashboardStatisticsContainer({totalApplicants, totalWillExpire, totalExpired}: Readonly<Props>) {
  return (
    <DashboardStatistics
      totalApplicants={totalApplicants}
      totalWillExpire={totalWillExpire}
      totalExpired={totalExpired}
    />
  )
}

interface Props {
  totalApplicants: number;
  totalWillExpire: number;
  totalExpired: number;
}

export default DashboardStatisticsContainer
