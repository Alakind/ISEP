import {render, screen} from "@testing-library/react";
import TableBodyLoadingContainer from "../../../../src/containers/table/loading/TableBodyLoadingContainer";

describe('TableBodyLoadingContainer', () => {
  it('should render the checkboxLoading component ', () => {
    render(<TableBodyLoadingContainer columns={[]} itemsPerPage={0}/>)

    const element = screen.getByTestId("table-body-loading");
    expect(element).toBeInTheDocument();
  });
})