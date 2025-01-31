import InvitesTableContainer from "../../../src/containers/dashboard/InvitesTableContainer.tsx";
import {render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";


describe('InvitesTableContainer', () => {
  it('should render the InvitesTable component ', () => {
    render(<MemoryRouter><InvitesTableContainer data={[]} dataApplicants={[]} columns={[]}/></MemoryRouter>)

    const element = screen.getByTestId("invites-table");
    expect(element).toBeInTheDocument();
  });
})