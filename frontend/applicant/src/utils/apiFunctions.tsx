import {
  AssignmentInterface,
  AssignmentMultipleChoiceInterface,
} from "./types";

const baseUrl = import.meta.env.VITE_API_APPLICANT_URL;

export async function sendMultipleChoiceSolution(
  assignment: AssignmentMultipleChoiceInterface,
  answer: number[]
): Promise<unknown> {
  let inviteId = localStorage.getItem("inviteId");

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

    return;
  } else {
    throw new Error(`Failed to retrive invite ID from localstorage`);
    // TODO: redirect to welcome/error page?
  }
}

export async function sendOpenSolution(
  assignment: AssignmentInterface,
  answer: string
): Promise<unknown> {
  let inviteId = localStorage.getItem("inviteId");

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

    return;
  } else {
    throw new Error(`Failed to retrive invite ID from localstorage`);
    // TODO: redirect to welcome/error page?
  }
}
