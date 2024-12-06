//https://jasonwatmore.com/post/2020/11/02/react-fetch-http-put-request-examples

import {ApplicantInterface, UserInterface} from "./types.tsx";
import {ApplicantStatuses, PreferredLanguages, Roles} from "./constants.tsx"

const baseUrl = import.meta.env.VITE_API_MANAGEMENT_URL;

// ------------------------------- GENERAL ----------------------------------//

export async function getSearch(currentPage: number, itemsPerPage: number, subUrl: string, keyword: string): Promise<{data: ApplicantInterface[] | UserInterface[], totalItems: number}> {
  const response: Response = await fetch(`${baseUrl}${subUrl}?page=${currentPage}&limit=${itemsPerPage}&search=${keyword}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();


  if (!response.ok) {
    throw new Error(`Failed to search for: ${keyword}`);
  }

  if (subUrl == "/user") {
    return {data: (data.data as UserInterface[]), totalItems: data.total};
  } else {
    return {data: (data.data as ApplicantInterface[]), totalItems: data.total};
  }
}

// ------------------------------ APPLICANT ---------------------------------//

export async function getApplicants(currentPage: number, itemsPerPage: number, orderBy: string, keyword: string): Promise<{data: ApplicantInterface[], totalItems: number}> {
  let url;
  if (itemsPerPage == -1) {
    url = `${baseUrl}/applicant?page=${currentPage}&limit=${itemsPerPage}${orderBy != "" ? "&sort="+ orderBy : ""}${keyword != "" ? "&search=" + keyword : ""}`;
  } else if (orderBy != "") {
    url = `${baseUrl}/applicant${orderBy != "" ? "?sort="+ orderBy : ""}${keyword != "" ? "&search=" + keyword : ""}`
  } else {
    url = `${baseUrl}/applicant${keyword != "" ? "?search=" + keyword : ""}`
  }
  const response: Response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve applicants`);
  }

  const data = await response.json();

  return {data: data.applicants, totalItems: data.total} ;
}

export async function getApplicant(id: string): Promise<ApplicantInterface> {
  //TODO uncomment and delete the other return with data when this api works
  /*const response: Response = await fetch(`${baseUrl}/applicant/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });


  if (!response.ok) {
    throw new Error(`Failed to retrieve applicant with id: ${id}`);
  }

  return await response.json();*/
  const data = {
    name: "Sasha Surname",
    id: "1234567890",
    email: "Sasha@email.com",
    score: 100,
    status: ApplicantStatuses.APP_ASSESSMENT_IN_PROGRESS,
    preferredLanguage: PreferredLanguages.SQL,
  }
  return data
}


export async function addApplicant(applicant: ApplicantInterface) : Promise<{data: ApplicantInterface}> {
  const response: Response = await fetch(`${baseUrl}/applicant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: 0,
      name: applicant.name,
      email: applicant.email,
      status: applicant.status.toString(),
      preferredLanguage: applicant.preferredLanguage,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add applicant: ${response.statusText}`);
  }

  return await response.json();
}

// --------------------------------- USER -----------------------------------//

export async function getUsers(currentPage: number, itemsPerPage: number, orderBy: string, keyword: string): Promise<{data: UserInterface[], totalItems: number}> {
  let url;
  if (itemsPerPage == -1) {
    url = `${baseUrl}/user?page=${currentPage}&limit=${itemsPerPage}${orderBy != "" ? "&sort="+ orderBy : ""}${keyword != "" ? "&search=" + keyword : ""}`;
  } else if (orderBy != "") {
    url = `${baseUrl}/user${orderBy != "" ? "?sort="+ orderBy : ""}${keyword != "" ? "&search=" + keyword : ""}`
  } else {
    url = `${baseUrl}/user${keyword != "" ? "?search=" + keyword : ""}`
  }

  const response: Response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to retrieve users`);
  }

  return {data: data.data, totalItems: data.total} ;
}

export async function updateRole(id: string, subUrl: string, role: typeof Roles): Promise<UserInterface> {
  if (id == import.meta.env.VITE_DEFAULT_ADMIN_ID) {
    throw new Error("The standard admin can't be deleted");
  }
  const response: Response = await fetch(`${baseUrl}${subUrl}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role: role.toString()
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update role: ${response.statusText}`);
  }

  return await response.json();
}

export async function deleteUser(id: string): Promise<string> {
  if (id == import.meta.env.VITE_DEFAULT_ADMIN_ID) {
    throw new Error("The standard admin can't be deleted");
  }
  const response: Response = await fetch(`${baseUrl}/user/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.statusText}`);
  }

  return await response.json();
}


