//https://jasonwatmore.com/post/2020/11/02/react-fetch-http-put-request-examples

import {ApplicantInterface, UserInterface} from "./types.tsx";
import {Roles} from "./constants.tsx"

const baseUrl = import.meta.env.VITE_API_MANAGEMENT_URL;
export async function updateAccess(subUrl: string, access: boolean): Promise<UserInterface> {
  const response: Response = await fetch(`${baseUrl}${subUrl}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access: access
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update access: ${response.statusText}`);
  }

  return await response.json();
}

export async function updateRole(subUrl: string, role: Roles): Promise<UserInterface> {
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

export async function getApplicants(currentPage: number, itemsPerPage: number): Promise<ApplicantInterface[]> {
  const response: Response = await fetch(`${baseUrl}/applicant?page=${currentPage}&limit=${itemsPerPage}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve applicants`);
  }

  return await response.json();
}