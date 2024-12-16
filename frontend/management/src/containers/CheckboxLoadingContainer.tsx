import CheckboxLoading from "../components/CheckboxLoading.tsx";
import {ReactNode} from "react";

function CheckboxLoadingContainer({id} : Props): ReactNode {
  return (
    <CheckboxLoading id={id} />
  )
}

interface Props {
  id: string;
}

export default CheckboxLoadingContainer
