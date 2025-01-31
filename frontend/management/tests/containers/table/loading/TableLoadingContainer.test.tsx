import TableLoadingContainer from "../../../../src/containers/table/loading/TableLoadingContainer.tsx";
import {render, screen} from "@testing-library/react";

describe('TableLoadingContainer', () => {
  it('should render the TableLoading component ', () => {
    render(<TableLoadingContainer columns={[]} itemsPerPage={0}/>)

    const element = screen.getByTestId("table-loading");
    expect(element).toBeInTheDocument();
  });
})