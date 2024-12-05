//https://jasonwatmore.com/post/2020/11/02/react-fetch-http-put-request-examples

import {ApplicantInterface, UserInterface} from "./types.tsx";
import {Roles} from "./constants.tsx"

const baseUrl = import.meta.env.VITE_API_MANAGEMENT_URL;

// ------------------------------- GENERAL ----------------------------------//

export async function getSearch(currentPage: number, itemsPerPage: number, subUrl: string, keyword: string): Promise<{data: ApplicantInterface[] | UserInterface[], totalItems: number}> {
  const response: Response = await fetch(`${baseUrl}${subUrl}?page=${currentPage}&limit=${itemsPerPage}&search=${keyword}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const totalItems: number = parseInt(response.headers.get("X-Total-Count"));
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to search for: ${keyword}`);
  }

  return {data: data, totalItems: totalItems};
}

// ------------------------------ APPLICANT ---------------------------------//

export async function getApplicants(currentPage: number, itemsPerPage: number): Promise<{data: ApplicantInterface[], totalItems: number}> {
  const response: Response = await fetch(`${baseUrl}/applicant?page=${currentPage}&limit=${itemsPerPage}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve applicants`);
  }

  const totalItems: number = parseInt(response.headers.get("X-Total-Count"));
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to retrieve users`);
  }

  return {data: data, totalItems: totalItems} ;
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

export async function getUsers(currentPage: number, itemsPerPage: number, orderBy: string): Promise<{data: UserInterface[], totalItems: number}> {
  let API_URL = `${baseUrl}/user?page=${currentPage}&limit=${itemsPerPage}${orderBy != "" ? "&orderBy="+ orderBy : ""}`;
  if (itemsPerPage == -1) {
    API_URL = `${baseUrl}/user${orderBy != "" ? "?orderBy="+ orderBy : ""}`;
  }
  const response: Response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const totalItems: number = parseInt(response.headers.get("X-Total-Count"));
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to retrieve users`);
  }

  return {data: data, totalItems: totalItems} ;
}

export async function updateRole(id: string, subUrl: string, role: Roles): Promise<UserInterface> {
  if (id == 523) {
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
  //TODO check if it isn't the fallback admin
  if (id == 523) {
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


