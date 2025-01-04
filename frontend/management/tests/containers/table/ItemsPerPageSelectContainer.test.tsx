import {render, screen} from "@testing-library/react";
import ItemsPerPageSelectContainer from "../../../src/containers/table/ItemsPerPageSelectContainer.tsx";

const mockSetItemsPerPage = vi.fn();

describe('ItemsPerPageSelectContainer', () => {
  it('should render the ItemsPerPageSelect component ', () => {
    render(<ItemsPerPageSelectContainer itemsPerPage={10} setItemsPerPage={mockSetItemsPerPage}/>)

    const element = screen.getByTestId("items-per-page-select");
    expect(element).toBeInTheDocument();
  });
})