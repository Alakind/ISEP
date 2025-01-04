import AssessmentResultsViewer from "../../../../src/components/applicant-personal/results/AssessmentResultsViewer.tsx";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {AssessmentInterface, AssignmentMultipleChoiceSolvedInterface, AssignmentOpenSolvedInterface, InviteInterface, SectionSolvedInterface} from "../../../../src/utils/types.tsx";
import {AssignmentTypes} from "../../../../src/utils/constants.tsx";
import {expect} from "vitest";
import {act} from "react";

describe('AssessmentResultsViewer Component', () => {
  const mockInvitesData: InviteInterface[] = [
    {
      id: "cce487c0-9ff7-47a8-9844-b406e046459b",
      applicantId: "90",
      assessmentId: "3",
      status: "not_started",
      invitedAt: "2024-12-30T00:28:25.485108Z",
      expiresAt: "2025-01-06T00:28:25.485108Z"
    },
    {
      id: "a543b334-2873-48b1-b5fb-64e9ab9df87b",
      applicantId: "90",
      assessmentId: "4",
      status: "app_finished",
      invitedAt: "2024-12-30T00:28:25.485638Z",
      expiresAt: "2025-01-06T00:28:25.485638Z"
    }
  ];

  const mockAssessmentsData: AssessmentInterface[] = [
    {id: '3', tag: 'JAVA assessment', sections: [5, 6]},
    {id: '4', tag: 'SQL assessment', sections: [7, 8]},
  ];

  const mockAssignment13: AssignmentMultipleChoiceSolvedInterface = {
    id: "13",
    description: "What will I get if I will sum 2 and 2?",
    availablePoints: 10,
    options: [
      "Isaac Newton",
      "Madagascar",
      "42"
    ],
    isMultipleAnswers: false,
    type: AssignmentTypes.MULTIPLE_CHOICE,
    answer: {
      type: AssignmentTypes.MULTIPLE_CHOICE,
      answer: []
    },
    referenceAnswer: {
      type: AssignmentTypes.MULTIPLE_CHOICE,
      answer: [
        0
      ]
    },
    scoredPoints: null
  }

  const mockAssignment14: AssignmentMultipleChoiceSolvedInterface = {
    id: "14",
    description: "Which member(s) should receive a red card?",
    availablePoints: 3,
    options: [
      "Jesse",
      "Ruben",
      "Everard",
      "Aleks",
      "Jarno"
    ],
    isMultipleAnswers: true,
    type: AssignmentTypes.MULTIPLE_CHOICE,
    answer: {
      type: AssignmentTypes.MULTIPLE_CHOICE,
      answer: []
    },
    referenceAnswer: {
      type: AssignmentTypes.MULTIPLE_CHOICE,
      answer: [
        0,
        1,
        3,
        4
      ]
    },
    scoredPoints: null
  }

  const mockAssignment15: AssignmentOpenSolvedInterface = {
    id: "15",
    description: "Write a 3000 words essay about Pepin the Short's conquests of the Rousillon.",
    availablePoints: 9,
    type: AssignmentTypes.OPEN,
    answer: {
      type: AssignmentTypes.OPEN,
      answer: ""
    },
    referenceAnswer: {
      type: AssignmentTypes.OPEN,
      answer: "words words words"
    },
    scoredPoints: null
  }

  const mockAssignment16: AssignmentMultipleChoiceSolvedInterface = {
    id: "16",
    description: "You are a 15th century plague doctor, please cure this sick person",
    availablePoints: 34,
    options: [
      "More mouse bites",
      "Mouse bites",
      "All of the above",
      "Leeches"
    ],
    isMultipleAnswers: true,
    type: AssignmentTypes.MULTIPLE_CHOICE,
    answer: {
      type: AssignmentTypes.MULTIPLE_CHOICE,
      answer: []
    },
    referenceAnswer: {
      type: AssignmentTypes.MULTIPLE_CHOICE,
      answer: [
        0,
        1,
        2
      ]
    },
    scoredPoints: null
  }

  const mockAssignment17: AssignmentMultipleChoiceSolvedInterface = {
    id: "17",
    description: "How Long is a Chinese person",
    availablePoints: 3,
    options: [
      "Option A",
      "Trick question",
      "169.7 cm (5 ft 7 in)"
    ],
    isMultipleAnswers: false,
    type: AssignmentTypes.MULTIPLE_CHOICE,
    answer: {
      type: AssignmentTypes.MULTIPLE_CHOICE,
      answer: []
    },
    referenceAnswer: {
      type: AssignmentTypes.MULTIPLE_CHOICE,
      answer: [
        1
      ]
    },
    scoredPoints: null
  }

  const mockAssignment18: AssignmentOpenSolvedInterface = {
    id: "18",
    description: "Prove whether or not P = NP in 150 words",
    availablePoints: 5,
    type: AssignmentTypes.OPEN,
    answer: {
      type: AssignmentTypes.OPEN,
      answer: ""
    },
    referenceAnswer: {
      type: AssignmentTypes.OPEN,
      answer: "Let P = NP, then PN = P."
    },
    scoredPoints: null
  }

  const mockAssignment19: AssignmentMultipleChoiceSolvedInterface = {
    id: "19",
    description: "What will I get if I will sum 2 and 2?",
    availablePoints: 10,
    options: [
      "Isaac Newton",
      "Madagascar",
      "42"
    ],
    isMultipleAnswers: false,
    type: AssignmentTypes.MULTIPLE_CHOICE,
    answer: {
      type: AssignmentTypes.MULTIPLE_CHOICE,
      answer: []
    },
    referenceAnswer: {
      type: AssignmentTypes.MULTIPLE_CHOICE,
      answer: [
        0
      ]
    },
    scoredPoints: null
  }

  const mockAssignment20: AssignmentMultipleChoiceSolvedInterface = {
    id: "20",
    description: "Which member(s) should receive a red card?",
    availablePoints: 10,
    options: [
      "Jesse",
      "Ruben",
      "Everard",
      "Aleks",
      "Jarno"
    ],
    isMultipleAnswers: true,
    type: AssignmentTypes.MULTIPLE_CHOICE,
    answer: {
      type: AssignmentTypes.MULTIPLE_CHOICE,
      answer: []
    },
    referenceAnswer: {
      type: AssignmentTypes.MULTIPLE_CHOICE,
      answer: [
        0,
        1,
        3,
        4
      ]
    },
    scoredPoints: null
  }

  const mockAssignment21: AssignmentOpenSolvedInterface = {
    id: "21",
    description: "Write a 3000 words essay about Pepin the Short's conquests of the Rousillon.",
    availablePoints: 2,
    type: AssignmentTypes.OPEN,
    answer: {
      type: AssignmentTypes.OPEN,
      answer: ""
    },
    referenceAnswer: {
      type: AssignmentTypes.OPEN,
      answer: "words words words"
    },
    scoredPoints: null
  }

  const mockAssignment22: AssignmentMultipleChoiceSolvedInterface = {
    id: "22",
    description: "You are a 15th century plague doctor, please cure this sick person",
    availablePoints: 2,
    options: [
      "More mouse bites",
      "Mouse bites",
      "All of the above",
      "Leeches"
    ],
    isMultipleAnswers: true,
    type: AssignmentTypes.MULTIPLE_CHOICE,
    answer: {
      type: AssignmentTypes.MULTIPLE_CHOICE,
      answer: []
    },
    referenceAnswer: {
      type: AssignmentTypes.MULTIPLE_CHOICE,
      answer: [
        0,
        1,
        2
      ]
    },
    scoredPoints: null
  }

  const mockAssignment23: AssignmentMultipleChoiceSolvedInterface = {
    id: "23",
    description: "How Long is a Chinese person",
    availablePoints: 3,
    options: [
      "Option A",
      "Trick question",
      "169.7 cm (5 ft 7 in)"
    ],
    isMultipleAnswers: false,
    type: AssignmentTypes.MULTIPLE_CHOICE,
    answer: {
      type: AssignmentTypes.MULTIPLE_CHOICE,
      answer: []
    },
    referenceAnswer: {
      type: AssignmentTypes.MULTIPLE_CHOICE,
      answer: [
        1
      ]
    },
    scoredPoints: null
  }

  const mockAssignment24: AssignmentOpenSolvedInterface = {
    id: "24",
    description: "Prove whether or not P = NP in 150 words",
    availablePoints: 59,
    type: AssignmentTypes.OPEN,
    answer: {
      type: AssignmentTypes.OPEN,
      answer: ""
    },
    referenceAnswer: {
      type: AssignmentTypes.OPEN,
      answer: "Let P = NP, then PN = P."
    },
    scoredPoints: null
  }

  const mockSectionsAssessment1: SectionSolvedInterface[] = [
    {
      id: "5",
      title: "Demo Section 1",
      scoredPoints: null,
      availablePoints: 22,
      measuredTime: "",
      suggestedTime: "",
      assignments: [
        mockAssignment13,
        mockAssignment14,
        mockAssignment15
      ],
      size: 3
    },
    {
      id: "6",
      title: "Demo Section 2",
      availablePoints: 42,
      scoredPoints: null,
      measuredTime: "",
      suggestedTime: "",
      assignments: [
        mockAssignment16,
        mockAssignment17,
        mockAssignment18
      ],
      size: 3
    }
  ];

  const mockSectionsAssessment2: SectionSolvedInterface[] = [
    {
      id: "7",
      title: "Demo Section 1",
      availablePoints: 22,
      measuredTime: "",
      suggestedTime: "",
      assignments: [
        mockAssignment19,
        mockAssignment20,
        mockAssignment21
      ],
      scoredPoints: null,
      size: 3
    },
    {
      id: "8",
      title: "Demo Section 2",
      availablePoints: 64,
      measuredTime: "",
      suggestedTime: "",
      assignments: [
        mockAssignment22,
        mockAssignment23,
        mockAssignment24
      ],
      scoredPoints: null,
      size: 3
    }
  ];

  const mockSectionsData: SectionSolvedInterface[][] = [mockSectionsAssessment1, mockSectionsAssessment2];

  const mockSetActiveAssessment = vi.fn();
  const mockSetActiveSection = vi.fn();

  it('renders the assessment selector when multiple assessments are available', async () => {
    render(
      <AssessmentResultsViewer
        assessmentsData={mockAssessmentsData}
        loading={false}
        sectionsData={mockSectionsData}
        activeSection={0}
        setActiveSection={mockSetActiveSection}
        activeAssessment={0}
        setActiveAssessment={mockSetActiveAssessment}
        invitesData={mockInvitesData}
      />
    );

    const selector = screen.getByTestId('assessment-results-viewer-select');
    await waitFor(() => {
      expect(selector).toBeInTheDocument();
    });

    const buttons = screen.getAllByTestId('select-button');
    await waitFor(() => {
      expect(buttons).toHaveLength(mockAssessmentsData.length);
    });
  });

  it('calls setActiveAssessment when an assessment button is clicked', async () => {
    render(
      <AssessmentResultsViewer
        assessmentsData={mockAssessmentsData}
        loading={false}
        sectionsData={mockSectionsData}
        activeSection={0}
        setActiveSection={mockSetActiveSection}
        activeAssessment={0}
        setActiveAssessment={mockSetActiveAssessment}
        invitesData={mockInvitesData}
      />
    );

    const buttons = screen.getAllByRole('button');
    await act(async () => {
      fireEvent.click(buttons[1]);
    });

    expect(mockSetActiveAssessment).toHaveBeenCalledWith(1);
  });

  it('renders the results overview when loading is false', async () => {
    render(
      <AssessmentResultsViewer
        assessmentsData={mockAssessmentsData}
        loading={false}
        sectionsData={mockSectionsData}
        activeSection={0}
        setActiveSection={mockSetActiveSection}
        activeAssessment={0}
        setActiveAssessment={mockSetActiveAssessment}
        invitesData={mockInvitesData}
      />
    );

    const resultsOverview = screen.getByTestId('assessment-results-overview');
    await waitFor(() => {
      expect(resultsOverview).toBeInTheDocument();
    });
  });

  it('renders the loading page when loading is true', () => {
    render(
      <AssessmentResultsViewer
        assessmentsData={mockAssessmentsData}
        loading={true}
        sectionsData={mockSectionsData}
        activeSection={0}
        setActiveSection={mockSetActiveSection}
        activeAssessment={0}
        setActiveAssessment={mockSetActiveAssessment}
        invitesData={mockInvitesData}
      />
    );

    const loadingPage = screen.getAllByTestId('loading-page');
    expect(loadingPage).toHaveLength(2);
    expect(loadingPage[0]).toBeInTheDocument();
    expect(loadingPage[1]).toBeInTheDocument();
  });

  it('renders the results sections when loading is false', async () => {
    render(
      <AssessmentResultsViewer
        assessmentsData={mockAssessmentsData}
        loading={false}
        sectionsData={mockSectionsData}
        activeSection={0}
        setActiveSection={mockSetActiveSection}
        activeAssessment={0}
        setActiveAssessment={mockSetActiveAssessment}
        invitesData={mockInvitesData}
      />
    );

    const resultsSections = screen.getByTestId('assessment-results-sections');
    await waitFor(() => {
      expect(resultsSections).toBeInTheDocument();
    });
  });

  it('renders the results with one assessment', async () => {
    const mockAssessmentsData: AssessmentInterface[] = [
      {id: '3', tag: 'JAVA assessment', sections: [5, 6]},
    ];

    const mockSectionsData: SectionSolvedInterface[][] = [mockSectionsAssessment1]

    render(
      <AssessmentResultsViewer
        assessmentsData={mockAssessmentsData}
        loading={false}
        sectionsData={mockSectionsData}
        activeSection={0}
        setActiveSection={mockSetActiveSection}
        activeAssessment={0}
        setActiveAssessment={mockSetActiveAssessment}
        invitesData={mockInvitesData}
      />
    );

    const resultsViewer = screen.getByTestId('assessment-results-viewer-results');
    await waitFor(() => {
      expect(resultsViewer).toBeInTheDocument();
      expect(resultsViewer).toHaveClass('results__container--single')
    });
  });
});