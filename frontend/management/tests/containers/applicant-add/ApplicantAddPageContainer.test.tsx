vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

import {fireEvent, render, screen} from "@testing-library/react";
import {MemoryRouter, useNavigate} from "react-router-dom";
import ApplicantAddPageContainer from "../../../src/containers/applicant-add/ApplicantAddPageContainer.tsx";

describe("ApplicantAddPageContainer", () => {
  it("renders the CardPageContainer and ApplicantAddPage components", () => {
    render(
      <MemoryRouter>
        <ApplicantAddPageContainer/>
      </MemoryRouter>
    );

    expect(screen.getByTestId("card-page-container")).toBeInTheDocument();
    expect(screen.getByTestId("applicant-add-card")).toBeInTheDocument();
  });

  it("navigates to /applicants when the button is clicked", () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <ApplicantAddPageContainer/>
      </MemoryRouter>
    );

    const button = screen.getByTestId("Back to all applicants");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/applicants");
  });
});