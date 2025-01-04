import TableHeadLoadingContainer from "../../../../src/containers/table/loading/TableHeadLoadingContainer.tsx";
import {render, screen} from "@testing-library/react";

describe('TableHeadLoadingContainer', () => {
  it('should render the TableHeadLoading component ', () => {
    render(<TableHeadLoadingContainer columns={[]}/>)

    const element = screen.getByTestId("table-head-loading");
    expect(element).toBeInTheDocument();
  });
})