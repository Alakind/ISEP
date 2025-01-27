import {toast} from "react-toastify";
import {AssessmentInterface, AssignmentInterface, PreInfoInterface} from "./types";
import {Languages} from "./constants";

const baseUrl = import.meta.env.VITE_API_APPLICANT_URL;

export async function sendMultipleChoiceSolution(assignment: AssignmentMultipleChoiceInterface, answer: string[]): Promise<void> {
  let inviteId: string | null = localStorage.getItem("inviteId");

  if (inviteId) {
    inviteId = String(inviteId);

    const body = {
      [assignment.id]: {
        type: assignment.type,
        answer,
      },
    };

    const response: Response = await fetch(`${baseUrl}/solution/${inviteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to save a solution: ${response.statusText}`);
    }
  } else {
    toast.error(`Failed to retrieve invite ID`);
    throw new Error(`Failed to retrieve invite ID from localstorage`);
  }
}

export async function sendOpenSolution(assignment: AssignmentInterface, answer: string): Promise<void> {
  let inviteId: string | null = localStorage.getItem("inviteId");

  if (inviteId) {
    inviteId = String(inviteId);

    const body = {
      [assignment.id]: {
        type: assignment.type,
        answer,
      },
    };

    const response: Response = await fetch(`${baseUrl}/solution/${inviteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to save a solution: ${response.statusText}`);
    }
  } else {
    toast.error(`Failed to retrieve invite ID`);
    throw new Error(`Failed to retrieve invite ID from localstorage`);
  }
}

export async function sendCodingSolution(assignment: AssignmentInterface, code: string, test: string): Promise<void> {
  let inviteId: string | null = localStorage.getItem("inviteId");

  if (inviteId) {
    inviteId = String(inviteId);

    const body = {
      [assignment.id]: {
        type: assignment.type,
        code,
        test,
      },
    };

    const response: Response = await fetch(`${baseUrl}/solution/${inviteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to save a solution: ${response.statusText}`);
    }
  } else {
    toast.error(`Failed to retrieve invite ID`);
    throw new Error(`Failed to retrieve invite ID from localstorage`);
  }
}

export async function fetchAssessment(inviteId: string): Promise<AssessmentInterface> {
  const API_SECTIONS_URL = `${baseUrl}/invite/${inviteId}/assessment`;

  const response = await fetch(API_SECTIONS_URL);

  if (!response.ok) {
    throw new Error("Couldn't connect to the server, please try again or email InfoSupport!");
  }

  const data = await response.json();

  const sectionsFetched = [];
  for (const element of data.sections) {
    const API_SECTION_URL = `${baseUrl}/section/${element}/solution/${inviteId}`;

    const responseSection = await fetch(API_SECTION_URL);
    if (!response.ok) {
      throw new Error("Couldn't connect to the server, please try again or email InfoSupport!");
    }
    const section = await responseSection.json();
    sectionsFetched.push({
      id: section.id,
      assignments: section.assignments,
      title: section.title,
    });
  }

  return {sections: sectionsFetched, availableSeconds: data.availableSeconds};
}

export async function runTests(language: (typeof Languages)[keyof typeof Languages], inviteId: string, code: string, test: string): Promise<Array<any>> {
  const API_SECTIONS_URL = `${import.meta.env.VITE_API_CODE_EXECUTION_URL}/code-executor/${inviteId}/${language}/test`;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const response = await fetch(API_SECTIONS_URL, {
    method: "POST",
    body: JSON.stringify({code: code, test: test}),
    headers: headers,
  });

  if (!response.ok) {
    throw new Error("Couldn't connect to the server, please try again or email InfoSupport!");
  }

  return await response.json();
}

export async function getSecondsLeft(inviteId: string): Promise<number> {
  const API_SECTIONS_URL = `${baseUrl}/timing/${inviteId}/left`;

  const response = await fetch(API_SECTIONS_URL);

  if (!response.ok) {
    throw new Error("Couldn't connect to the server, please try again or email InfoSupport!");
  }

  const data = await response.json();

  return data.seconds;
}

export async function switchSection(inviteId: string, sectionId: string): Promise<void> {
  const API_SECTIONS_URL = `${baseUrl}/timing/${inviteId}/switch`;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const response = await fetch(API_SECTIONS_URL, {
    method: "PUT",
    body: JSON.stringify({id: sectionId}),
    headers: headers,
  });

  if (!response.ok) {
    throw new Error("Couldn't connect to the server, please try again or email InfoSupport!");
  }
}

export async function finishAssessment(inviteId: string): Promise<void> {
  const API_URL = `${baseUrl}/invite`;

  const response: Response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: inviteId,
      status: "app_finished",
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to finish the assessment: ${response.statusText}`);
  }
}

export async function getPreInfo(inviteId: string): Promise<PreInfoInterface> {
  const API_URL = `${baseUrl}/invite/${inviteId}/info`;

  const response: Response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve pre info of the assessment: ${response.statusText}`);
  }

  return response.json();
}

