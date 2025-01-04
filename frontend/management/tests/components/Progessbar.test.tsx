import Progressbar from "../../src/components/Progressbar.tsx";
import {render, screen} from "@testing-library/react";
import {ApplicantInterface} from "../../src/utils/types.tsx";

describe('Progressbar', () => {
  let applicant: ApplicantInterface = {
    id: '123',
    email: "johndoe@gmail.com",
    invites: [],
    name: "John Doe",
    preferredLanguage: "Kotlin",
    score: 10,
    statuses: [],
  };

  it('renders correctly with a score', () => {
    render(<Progressbar applicant={applicant}/>);

    const progressElement = screen.getByRole('progressbar');
    expect(progressElement).toBeInTheDocument();
    expect(progressElement).toHaveAttribute('max', '100');
    expect(progressElement).toHaveAttribute('value', '10');
    expect(progressElement.textContent).toContain('(10%)');
  });

  it('renders correctly without a score', () => {
    applicant = {
      ...applicant,
      score: undefined
    }

    render(<Progressbar applicant={applicant}/>);

    const progressElement = screen.getByRole('progressbar');
    expect(progressElement).toBeInTheDocument();
    expect(progressElement).toHaveAttribute('max', '100');
    expect(progressElement).toHaveAttribute('value', '0');
    expect(progressElement.textContent).toContain('(0%)');
  });

  it('renders with the correct id based on applicant id', () => {
    render(<Progressbar applicant={applicant}/>);

    const progressElement = screen.getByRole('progressbar');
    expect(progressElement).toHaveAttribute('id', 'progressbar123');
  });
})