import "../../styles/dashboard-statistics.css";

function DashboardStatistics({totalApplicants, totalWillExpire, totalExpired}: Readonly<Props>) {
  return (
    <>
      <div className="dashboard-statistics-blocks">
        <h1> {totalApplicants ?? 0} </h1>
        <div className="dashboard-statistics-bottom">
          <p>Total Applicants</p>
        </div>
      </div>
      <div className="dashboard-statistics-blocks">
        <h1> {totalWillExpire ?? 0} </h1>
        <div className="dashboard-statistics-bottom">
          <p>Will expire in 2 days</p>
        </div>
      </div>
      <div className="dashboard-statistics-blocks">
        <h1> {totalExpired ?? 0} </h1>
        <div className="dashboard-statistics-bottom">
          <p>Have Expired</p>
        </div>
      </div>
    </>
  )
}

interface Props {
  totalApplicants?: number;
  totalWillExpire?: number;
  totalExpired?: number;
}

export default DashboardStatistics
