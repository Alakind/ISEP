import {ApplicantInterface, AssessmentInterface, AssignmentInterface, BarChartInterface, InviteInterface, SectionInterface, SectionSolvedInterface, SkillsInterface, UserInterface} from "./types.tsx";
import {EmailTypes, InviteDateAttributes, InviteStatuses} from "./constants.tsx";
import {testUuidValidity} from "./general.tsx";

// ------------------------------ URL ---------------------------------//

const baseUrl = import.meta.env.VITE_API_MANAGEMENT_URL;

function getUrl(
  rootUrl: string,
  currentPage: number,
  itemsPerPage: number,
  orderBy: string,
  query: string,
  defaultOrderBy: string
): string {
  const url = `${baseUrl}/${rootUrl}`;
  const params: string[] = [];

  if (itemsPerPage !== -1) {
    params.push(`page=${currentPage}`, `size=${itemsPerPage}`);
  }

  if (orderBy) {
    params.push(`sort=${orderBy}`);
  } else if (itemsPerPage === -1) {
    params.push(`sort=${defaultOrderBy}`);
  }

  if (query) {
    params.push(query);
  }

  return params.length > 0 ? `${url}?${params.join("&")}` : url;
}

function getUrlInvites(
  status?: (typeof InviteStatuses)[keyof typeof InviteStatuses],
  betweenDateAttribute?: string,
  startDate?: string,
  endDate?: string,
  orderBy?: string,
): string {
  const url = `${baseUrl}/invite`;
  const params: string[] = [];

  if (status) {
    params.push(`status=${status}`);
  }

  if (betweenDateAttribute) {
    if (startDate && endDate) {
      params.push(`startDate=${startDate}`, `endDate=${endDate}`);
    } else if (startDate) {
      params.push(`startDate=${startDate}`);
    } else if (endDate) {
      params.push(`endDate=${endDate}`);
    }
    params.push(`betweenDateAttribute=${betweenDateAttribute}`)
  }

  if (orderBy) {
    params.push(`sort=${orderBy}`);
  }

  return params.length > 0 ? `${url}?${params.join("&")}` : url;
}

// ------------------------------ APPLICANT ---------------------------------//

export async function getApplicants(currentPage: number, itemsPerPage: number, orderBy: string, query: string): Promise<{ data: ApplicantInterface[], totalItems: number }> {
  const url = getUrl("applicant", currentPage, itemsPerPage, orderBy, query, "name,asc")
  const response: Response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve applicants`);
  }

  const data: { data: ApplicantInterface[], total: number } = await response.json();

  return {data: data.data, totalItems: data.total};
}

export async function getApplicant(id: string): Promise<ApplicantInterface> {
  const response: Response = await fetch(`${baseUrl}/applicant/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });


  if (!response.ok) {
    throw new Error(`Failed to retrieve applicant`);
  }

  return await response.json();
}

export async function addApplicant(data: Partial<ApplicantInterface>): Promise<{ id: string }> {
  const response: Response = await fetch(`${baseUrl}/applicant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: 0,
      ...data,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add applicant: ${response.statusText}`);
  }

  const id = response.headers.get("Location")?.split("/")[4];
  if (!id) {
    throw new Error(`Failed to add applicant: ${response.statusText}`);
  }

  return {id: id};
}

export async function updateApplicant(id: string, data: Partial<ApplicantInterface>): Promise<{ data: Partial<ApplicantInterface> }> {
  const response: Response = await fetch(`${baseUrl}/applicant`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      ...data,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update applicant: ${response.statusText}`);
  }

  return {
    data: {
      id: id,
      ...data
    }
  };
}

export async function deleteApplicant(id: string): Promise<string> {
  const response: Response = await fetch(`${baseUrl}/applicant/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete applicant: ${response.statusText}`);
  }

  return `Successfully deleted applicant`;
}

// --------------------------------- INVITES -----------------------------------//

export async function getInvites(
  status?: (typeof InviteStatuses)[keyof typeof InviteStatuses],
  betweenDateAttribute?: (typeof InviteDateAttributes)[keyof typeof InviteDateAttributes],
  startDate?: string,
  endDate?: string,
  orderBy?: string
): Promise<{ data: InviteInterface[], totalItems: number }> {
  const url = getUrlInvites(status, betweenDateAttribute, startDate, endDate, orderBy);
  const response: Response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve invites`);
  }
  const data: { data: InviteInterface[], total: number } = await response.json();

  return {data: data.data, totalItems: data.total};
}

export async function getInvite(id: string): Promise<InviteInterface> {
  const response: Response = await fetch(`${baseUrl}/invite/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve invite`);
  }

  return await response.json();
}

export async function addInvite(applicantId: string, assessmentId: string, expiresAt: string): Promise<string> {
  const response: Response = await fetch(`${baseUrl}/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      applicantId: applicantId,
      assessmentId: assessmentId,
      expiresAt: expiresAt
    }),
  });

  const id = response.headers.get("Location")?.split("/").pop();
  if (id !== undefined && !testUuidValidity(id)) {
    throw new Error(`Failed to invite applicant: ${response.statusText}`);
  }

  if (!response.ok) {
    throw new Error(`Failed to invite applicant: ${response.statusText}`);
  }

  return `${id}`;
}

export async function updateInvite(id: string, data: Partial<InviteInterface>): Promise<{ data: Partial<InviteInterface> }> {
  const response: Response = await fetch(`${baseUrl}/invite`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      ...data,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update invite: ${response.statusText}`);
  }

  return {
    data: {
      id: id,
      ...data
    }
  };
}

export async function deleteInvite(id: string): Promise<string> {
  const response: Response = await fetch(`${baseUrl}/invite/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete invite: ${response.statusText}`);
  }

  return `Successfully deleted invite`;
}

// --------------------------------- EMAIL -----------------------------------//

export async function sendMail(applicantId: string, inviteId: string, type: (typeof EmailTypes)[keyof typeof EmailTypes], additionalMessage?: string): Promise<string> {
  const response: Response = await fetch(`${baseUrl}/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      applicantId: applicantId,
      inviteId: inviteId,
      type: type,
      additionalMessage: additionalMessage
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send email request: ${response.statusText}`);
  }

  return "Successfully send email request";
}

// --------------------------------- USER -----------------------------------//

export async function getUsers(currentPage: number, itemsPerPage: number, orderBy: string, query: string): Promise<{ data: UserInterface[], totalItems: number }> {
  const url = getUrl("user", currentPage, itemsPerPage, orderBy, query, "name,asc")

  const response: Response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve users`);
  }

  const data: { data: UserInterface[], total: number } = await response.json();

  return {data: data.data, totalItems: data.total};
}

// addUser is not part of the system

export async function updateUser(id: string, data: Partial<UserInterface>): Promise<{ data: Partial<UserInterface> }> {
  if (data.email == import.meta.env.VITE_DEFAULT_ADMIN_EMAIL) {
    throw new Error("The standard admin can't be updated");
  }
  const response: Response = await fetch(`${baseUrl}/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      ...data,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user: ${response.statusText}`);
  }

  return {
    data: {
      id: id,
      ...data
    }
  };
}

export async function deleteUser(id: string): Promise<string> {
  if (id == import.meta.env.VITE_DEFAULT_ADMIN_ID) {
    throw new Error("The standard admin can't be deleted");
  }
  //TODO uncomment when auth is implemented
  // if (id == currentuser.id) {
  //   throw new Error(`Can't delete current user`);
  // }
  const response: Response = await fetch(`${baseUrl}/user/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.statusText}`);
  }

  return `Successfully deleted user`;
}

// --------------------------------- ASSESSMENT -----------------------------------//

export async function getAssessments(currentPage: number = 0, itemsPerPage: number = -1, orderBy: string = "", query: string = ""): Promise<{ data: AssessmentInterface[], totalItems: number }> {
  const url = getUrl("assessment", currentPage, itemsPerPage, orderBy, query, "tag,asc")

  const response: Response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve assessments`);
  }

  const data: { data: AssessmentInterface[], total: number } = await response.json();

  return {data: data.data, totalItems: data.total};
}

export async function getAssessment(id: string): Promise<AssessmentInterface> {
  const response: Response = await fetch(`${baseUrl}/assessment/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve assessment`);
  }

  return await response.json();
}

export async function getSection(id: string): Promise<SectionInterface> {
  const response: Response = await fetch(`${baseUrl}/section/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve section`);
  }

  return await response.json();
}

export async function getSectionResult(id: string, inviteId: string): Promise<SectionSolvedInterface> {
  const response: Response = await fetch(`${baseUrl}/section/${id}/result/${inviteId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve result of section`);
  }

  return await response.json();
}

export async function getAssignment(id: string): Promise<AssignmentInterface> {
  const response: Response = await fetch(`${baseUrl}/assignment/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve assignment`);
  }

  return await response.json();
}

export async function getBarChartStats(inviteId: string): Promise<BarChartInterface> {
  console.log(inviteId)
  //TODO uncomment next part when implemented
  /*const response: Response = await fetch(`${baseUrl}/statistics`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inviteId: inviteId,
    }),
  });


  if (!response.ok) {
    throw new Error(`Failed to retrieve bar chart statistics`);
  }

  return await response.json();*/
  return {
    percentage: "46.17",
    barGroups: [
      {
        value: "1",
        isSelected: false,
      },
      {
        value: "4",
        isSelected: false,
      },
      {
        value: "14",
        isSelected: false,
      },
      {
        value: "24",
        isSelected: false,
      },
      {
        value: "31",
        isSelected: true,
      },
      {
        value: "14",
        isSelected: false,
      },
      {
        value: "9",
        isSelected: false,
      },
      {
        value: "1",
        isSelected: false,
      },
      {
        value: "1",
        isSelected: false,
      },
      {
        value: "1",
        isSelected: false,
      },
    ]
  };
}

export async function getSkillsStats(assessmentId: string, inviteId: string): Promise<SkillsInterface[]> {
  const response: Response = await fetch(`${baseUrl}/assessment/${assessmentId}/result/${inviteId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve skills`);
  }

  return await response.json();
}

export async function updateScoredPointsAssignment(id: string, value: number, inviteId: string): Promise<string> {
  const response: Response = await fetch(`${baseUrl}/assignment/${id}/result/${inviteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      scoredPoints: value
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update scored points for assignment ${id}`);
  }

  return "Successfully updated score";
}