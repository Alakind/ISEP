vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

import {fireEvent, render, screen} from "@testing-library/react";
import {MemoryRouter, useNavigate} from "react-router-dom";
import ApplicantInvitePageContainer from "../../../src/containers/applicant-invite/ApplicantInvitePageContainer.tsx";

describe("ApplicantInvitePageContainer", () => {
  it("renders the ApplicantInvitePageContainer and ApplicantInvitePage components", () => {
    render(
      <MemoryRouter>
        <ApplicantInvitePageContainer/>
      </MemoryRouter>
    );

    expect(screen.getByTestId("card-page-container")).toBeInTheDocument();
    expect(screen.getByTestId("applicant-invite-card")).toBeInTheDocument();
  });

  it("navigates to /applicants when the button is clicked", () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <ApplicantInvitePageContainer/>
      </MemoryRouter>
    );

    const button = screen.getByTestId("Back to all applicants");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/applicants");
  });
});