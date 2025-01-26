import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {MemoryRouter, useNavigate} from "react-router-dom";
import ApplicantInvitePageContainer from "../../../src/containers/applicant-invite/ApplicantInvitePageContainer.tsx";
import {Roles} from "../../../src/utils/constants.tsx";
import {vi} from "vitest";
import {useUserData} from "../../../src/utils/msal/UseUserData.tsx";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("../../../src/utils/msal/UseUserData.tsx", () => ({
  useUserData: vi.fn(() => ({role: Roles.ADMIN})),
}))

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

  it('shouldn\'t render no access page a Recruiter role', async () => {
    vi.mocked(useUserData).mockReturnValueOnce({email: "", id: "", name: "", oid: "", role: Roles.RECRUITER});

    render(<MemoryRouter><ApplicantInvitePageContainer/></MemoryRouter>);

    await waitFor(() => {
      expect(screen.queryByRole('heading', {name: "Access denied"})).not.toBeInTheDocument();
    });
  });

  it('should render no access page a Interviewer role', async () => {
    vi.mocked(useUserData).mockReturnValueOnce({email: "", id: "", name: "", oid: "", role: Roles.INTERVIEWER});

    render(<MemoryRouter><ApplicantInvitePageContainer/></MemoryRouter>);
    await waitFor(() => {
      expect(screen.queryByRole('heading', {name: "Access denied"})).toBeInTheDocument();
    });
  });

  it('shouldn\'t render no access page a Admin role', async () => {
    vi.mocked(useUserData).mockReturnValueOnce({email: "", id: "", name: "", oid: "", role: Roles.ADMIN});

    render(<MemoryRouter><ApplicantInvitePageContainer/></MemoryRouter>);
    await waitFor(() => {
      expect(screen.queryByRole('heading', {name: "Access denied"})).not.toBeInTheDocument();
    });
  });
});