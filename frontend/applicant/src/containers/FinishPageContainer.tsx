import FinishPage from "../components/FinishPage.tsx";


function FinishPageContainer() {
  const name: string | null = localStorage.getItem("name");
  return (
    <FinishPage name={name}/>
  )
}

export default FinishPageContainer
