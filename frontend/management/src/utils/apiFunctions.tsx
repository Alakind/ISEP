import {ApplicantInterface, UserInterface} from "./types.tsx";

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
  if (itemsPerPage != -1) {
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

  return {data: data.data as ApplicantInterface[], totalItems: data.total} ;
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


export async function addApplicant(data: Record<string, any>) : Promise<{data: ApplicantInterface}> {
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

  return {data: await response.json()};
}

export async function updateApplicant(id: string, data: Record<string, any>) : Promise<{ data: any }> {
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

  return {data: await response.json()};
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

// --------------------------------- USER -----------------------------------//

export async function getUsers(currentPage: number, itemsPerPage: number, orderBy: string, keyword: string): Promise<{data: UserInterface[], totalItems: number}> {
  let url;
  if (itemsPerPage != -1) {
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

  return {data: data.data as UserInterface[], totalItems: data.total} ;
}

// addUser is not part of the system

export async function updateUser(id: string, data: Record<string, any>): Promise<{ data: any }> {
  if (data.email == import.meta.env.VITE_DEFAULT_ADMIN_EMAIL) {
    throw new Error("The standard admin can't be deleted");
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

  return {data: {
      id: id,
      ...data
    }
  };
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

  return `Successfully deleted user`;
}


