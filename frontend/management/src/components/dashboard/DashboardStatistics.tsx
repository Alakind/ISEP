import "../../styles/dashboard-statistics.css";

function DashboardStatistics({}: Readonly<Props>) {
  return (
    <>
      <div className="dashboard-statistics-blocks">
        <h1> 123 </h1>
        <div className="dashboard-statistics-bottom">
          <p>Total Applicants</p>
        </div>
      </div>
      <div className="dashboard-statistics-blocks">
        <h1> 3 </h1>
        <div className="dashboard-statistics-bottom">
          <p>Will expire in 2 days</p>
        </div>
      </div>
      <div className="dashboard-statistics-blocks">
        <h1> 1 </h1>
        <div className="dashboard-statistics-bottom">
          <p>Have Expired</p>
        </div>
      </div>
    </>
  )
}

interface Props {
}

export default DashboardStatistics
