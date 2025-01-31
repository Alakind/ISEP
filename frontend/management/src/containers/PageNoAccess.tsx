import "../styles/no-access-page.css";

function PageNoAccess() {
  return (
    <div className={"page page--center"}>
      <h1 className={"no-access__header"}>Access denied</h1>
      <p>You don't have access to view this page.<br></br>Please contact your admin if this is incorrect.</p>
    </div>
  )
}

export default PageNoAccess
