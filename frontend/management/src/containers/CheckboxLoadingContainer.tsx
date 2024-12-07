import CheckboxLoading from "../components/CheckboxLoading.tsx";

function CheckboxLoadingContainer({id} : Props) {
  return (
    <CheckboxLoading id={id} />
    // <span className="table-loading__row__cell table-loading__row__select">CheckboxLoadingContainer</span>
  )
}

interface Props {
  id: string;
}

export default CheckboxLoadingContainer
