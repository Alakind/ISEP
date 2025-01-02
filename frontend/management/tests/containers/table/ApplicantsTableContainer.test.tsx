import ApplicantsTableContainer from "../../../src/containers/table/ApplicantsTableContainer.tsx";
import {render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";

const mockSetOrderBy = vi.fn();

describe('ApplicantsTableContainer', () => {
  it('should render the ApplicantsTable component ', () => {
    render(<MemoryRouter><ApplicantsTableContainer data={[]} orderBy={""} setOrderBy={mockSetOrderBy}/></MemoryRouter>)

    const element = screen.getByTestId("applicants-table");
    expect(element).toBeInTheDocument();
  });
})