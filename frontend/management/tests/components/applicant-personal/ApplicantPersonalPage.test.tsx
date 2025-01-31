import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import ApplicantPersonalPage from "../../../src/components/applicant-personal/ApplicantPersonalPage.tsx";
import {ApplicantInterface, AssessmentInterface, InviteInterface} from "../../../src/utils/types.tsx";
import {MemoryRouter} from "react-router-dom";

describe('ApplicantPersonalPage Component', () => {
  const mockApplicant: ApplicantInterface = {
    id: '1',
    name: 'John Doe',
    email: "johndoe@gmail.com",
    preferredLanguage: "Kotlin",
    invites: ["cce487c0-9ff7-47a8-9844-b406e046459b", "a543b334-2873-48b1-b5fb-64e9ab9df87b"]
  };

  const mockInvitesData: InviteInterface[] = [
    {
      id: "cce487c0-9ff7-47a8-9844-b406e046459b",
      applicantId: "90",
      assessmentId: "3",
      status: "not_started",
      invitedAt: "2024-12-30T00:28:25.485108Z",
      expiresAt: "2025-01-06T00:28:25.485108Z",
      measuredSecondsPerSection: []
    },
    {
      id: "a543b334-2873-48b1-b5fb-64e9ab9df87b",
      applicantId: "90",
      assessmentId: "4",
      status: "app_finished",
      invitedAt: "2024-12-30T00:28:25.485638Z",
      expiresAt: "2025-01-06T00:28:25.485638Z",
      measuredSecondsPerSection: []
    }
  ];

  const mockAssessmentsData: AssessmentInterface[] = [
    {id: '3', tag: 'JAVA assessment', sections: [5, 6]},
    {id: '4', tag: 'SQL assessment', sections: [7, 8]},
  ];

  const mockSetApplicant = vi.fn();
  const mockGoToApplicantsPage = vi.fn();
  const mockSetInvitesData = vi.fn();

  it('renders the header and back button', () => {
    render(
      <MemoryRouter>
        <ApplicantPersonalPage
          applicant={mockApplicant}
          setApplicant={mockSetApplicant}
          goToApplicantsPage={mockGoToApplicantsPage}
          invitesData={mockInvitesData}
          assessmentsData={mockAssessmentsData}
          setInvitesData={mockSetInvitesData}
        />
      </MemoryRouter>
    );

    const header = screen.getByTestId('card-header-container');
    const backButton = screen.getByText(/back to all applicants/i);

    expect(header).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
  });

  it('calls goToApplicantsPage when back button is clicked', () => {
    render(
      <MemoryRouter>
        <ApplicantPersonalPage
          applicant={mockApplicant}
          setApplicant={mockSetApplicant}
          goToApplicantsPage={mockGoToApplicantsPage}
          invitesData={mockInvitesData}
          assessmentsData={mockAssessmentsData}
          setInvitesData={mockSetInvitesData}
        />
      </MemoryRouter>
    );

    const backButton = screen.getByText(/back to all applicants/i);
    fireEvent.click(backButton);

    expect(mockGoToApplicantsPage).toHaveBeenCalled();
  });

  it('renders the ApplicantPersonalCardContainer', () => {
    render(
      <MemoryRouter>
        <ApplicantPersonalPage
          applicant={mockApplicant}
          setApplicant={mockSetApplicant}
          goToApplicantsPage={mockGoToApplicantsPage}
          invitesData={mockInvitesData}
          assessmentsData={mockAssessmentsData}
          setInvitesData={mockSetInvitesData}
        />
      </MemoryRouter>
    );

    const personalCard = screen.getByTestId('applicant-personal-card');
    expect(personalCard).toBeInTheDocument();
  });

  it('renders the InvitesOverviewContainer', () => {
    render(
      <MemoryRouter>
        <ApplicantPersonalPage
          applicant={mockApplicant}
          setApplicant={mockSetApplicant}
          goToApplicantsPage={mockGoToApplicantsPage}
          invitesData={mockInvitesData}
          assessmentsData={mockAssessmentsData}
          setInvitesData={mockSetInvitesData}
        />
      </MemoryRouter>
    );

    const invitesOverview = screen.getByTestId('invites-overview');
    expect(invitesOverview).toBeInTheDocument();
  });

  it('renders the AssessmentResultsViewerContainer when invites and assessments are available', () => {
    render(
      <MemoryRouter>
        <ApplicantPersonalPage
          applicant={mockApplicant}
          setApplicant={mockSetApplicant}
          goToApplicantsPage={mockGoToApplicantsPage}
          invitesData={mockInvitesData}
          assessmentsData={mockAssessmentsData}
          setInvitesData={mockSetInvitesData}
        />
      </MemoryRouter>
    );
    const assessmentResults = screen.getByTestId('assessment-results-viewer');
    expect(assessmentResults).toBeInTheDocument();
  });

  it('does not render the AssessmentResultsViewerContainer when invites are not available', () => {
    render(
      <MemoryRouter>
        <ApplicantPersonalPage
          applicant={{...mockApplicant, invites: []}}
          setApplicant={mockSetApplicant}
          goToApplicantsPage={mockGoToApplicantsPage}
          invitesData={mockInvitesData}
          assessmentsData={mockAssessmentsData}
          setInvitesData={mockSetInvitesData}
        />
      </MemoryRouter>
    );

    const assessmentResults = screen.queryByTestId('assessment-results-viewer');
    expect(assessmentResults).not.toBeInTheDocument();
  });
});