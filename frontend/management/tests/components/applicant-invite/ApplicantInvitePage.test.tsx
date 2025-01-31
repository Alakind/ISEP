import {fireEvent, render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import ApplicantInvitePage from "../../../src/components/applicant-invite/ApplicantInvitePage.tsx";

describe('ApplicantInvitePage component', () => {
  it('renders the CardHeaderContainer with the back button', () => {
    const mockGoToApplicantsPage = vi.fn();

    render(
      <MemoryRouter>
        <ApplicantInvitePage goToApplicantsPage={mockGoToApplicantsPage}/>
      </MemoryRouter>
    );

    const cardHeader = screen.getByTestId('card-header-container');
    expect(cardHeader).toBeInTheDocument();

    const backButton = screen.getByText(/back to all applicants/i);
    expect(backButton).toBeInTheDocument();
  });

  it('calls goToApplicantsPage when the back button is clicked', () => {
    const mockGoToApplicantsPage = vi.fn();

    render(
      <MemoryRouter>
        <ApplicantInvitePage goToApplicantsPage={mockGoToApplicantsPage}/>
      </MemoryRouter>
    );

    const backButton = screen.getByText(/back to all applicants/i);
    fireEvent.click(backButton);

    expect(mockGoToApplicantsPage).toHaveBeenCalled();
  });

  it('renders the CardBodyContainer with the ApplicantAddCardContainer', () => {
    const mockGoToApplicantsPage = vi.fn();

    render(
      <MemoryRouter>
        <ApplicantInvitePage goToApplicantsPage={mockGoToApplicantsPage}/>
      </MemoryRouter>
    );

    const cardBody = screen.getByTestId('card-body-container');
    expect(cardBody).toBeInTheDocument();

    const applicantInviteCard = screen.getByTestId('invitation-settings');
    expect(applicantInviteCard).toBeInTheDocument();
  });
})