//https://github.com/LazyFatArrow/vitest-mock-fetch-api/blob/master/src/services/todo/todo.service.test.js

import {
  addApplicant,
  addInvite,
  deleteApplicant,
  deleteInvite,
  deleteUser,
  getApplicant,
  getApplicants,
  getAssessment,
  getAssessments,
  getAssignment,
  getBarChartStats,
  getInvite,
  getInvites,
  getSection,
  getSectionResult,
  getSkillsStats,
  getUsers,
  sendMail,
  updateApplicant,
  updateInvite,
  updateScoredPointsAssignment,
  updateUser,
} from "../../src/utils/apiFunctions";
import {Mock} from "vitest";
import {
  ApplicantInterface,
  AssessmentInterface,
  AssignmentInterface,
  BarChartInterface,
  InviteInterface,
  SectionInterface,
  SectionSolvedInterface,
  SkillsInterface,
  UserInterface
} from "../../src/utils/types.tsx";
import {AssignmentTypes, EmailTypes} from "../../src/utils/constants.tsx";

// Mock fetch globally
global.fetch = vi.fn();

const mockFetch = fetch as Mock;

function createFetchResponse(data: unknown): () => Promise<unknown> {
  return (): Promise<unknown> => new Promise((resolve: (value: unknown) => void): void => resolve(data))
}

describe("API Functions (applicants)", (): void => {
  beforeEach((): void => {
    mockFetch.mockReset();
  });

  // examples of valid applicant urls:
  // 1. https://localhost:8081/applicant returns with sort=name,asc , page=0 and size="all" as standard (not implemented)
  // 2. https://localhost:8081/applicant?sort=name,asc
  // 3. https://localhost:8081/applicant?sort=name,desc (same as 2)
  // 4. https://localhost:8081/applicant?sort=email,asc (same as 2)
  // 5. https://localhost:8081/applicant?sort=name,asc&sort=email,asc (not implemented)
  // 6. https://localhost:8081/applicant?sort=name,asc&name=john
  // 7. https://localhost:8081/applicant?page=0 (not implemented)
  // 8. https://localhost:8081/applicant?page=0&sort=name,asc (not implemented)
  // 9. https://localhost:8081/applicant?page=0&size=10&sort=name,asc
  // 10. https://localhost:8081/applicant?page=0&size=10&sort=name,asc&name=john
  // 11. https://localhost:8081/applicant?page=0&size=10&sort=name,asc&email=john (same as 10)
  // 12. https://localhost:8081/applicant?page=0&size=10&sort=name,asc&name=john&email=john (same as 10)

  // examples of invalid applicant urls:
  // 1. https://localhost:8081/applicant?page=1 (this will return an empty data set, because everything is on page 0)

  it("(valid 2, 3, 4) should fetch applicants standard with standard sort", async (): Promise<void> => {
    const mockResponse = {
      data: [{id: "1", name: "John Doe", email: "johndoe@gmail.com"}],
      total: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockResponse),
    });

    const result: { data: ApplicantInterface[], totalItems: number } = await getApplicants(0, -1, "", "");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/applicant?sort=name,asc`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual({
      data: mockResponse.data,
      totalItems: mockResponse.total,
    });
  });

  it("(valid 6) should fetch applicants with valid page, negative size, sort and query", async (): Promise<void> => {
    const mockResponse = {
      data: [{id: "1", name: "John Doe", email: "johndoe@gmail.com"}],
      total: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockResponse),
    });

    const result: { data: ApplicantInterface[], totalItems: number } = await getApplicants(0, -1, "name,asc", "name=john");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/applicant?sort=name,asc&name=john`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual({
      data: mockResponse.data,
      totalItems: mockResponse.total,
    });
  });

  it("(valid 9) should fetch applicants with valid page, positive size and sort", async (): Promise<void> => {
    const mockResponse = {
      data: [{id: "1", name: "John Doe", email: "johndoe@gmail.com"}],
      total: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockResponse),
    });

    const result: { data: ApplicantInterface[], totalItems: number } = await getApplicants(0, 10, "name,asc", "");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/applicant?page=0&size=10&sort=name,asc`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual({
      data: mockResponse.data,
      totalItems: mockResponse.total,
    });
  });

  it("(valid 10, 11, 12) should fetch applicants with valid page, non-negative size, sort and query", async (): Promise<void> => {
    const mockResponse = {
      data: [{id: "1", name: "John Doe", email: "johndoe@gmail.com"}],
      total: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockResponse),
    });

    const result: { data: ApplicantInterface[], totalItems: number } = await getApplicants(0, 10, "name,asc", "name=john");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/applicant?page=0&size=10&sort=name,asc&name=john`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual({
      data: mockResponse.data,
      totalItems: mockResponse.total,
    });
  });

  it("should throw error when fetching applicants fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      getApplicants(1, 10, "name,asc", "")
    ).rejects.toThrow("Failed to retrieve applicants");
  });

  it("should fetch a single applicant by ID", async () => {
    const mockApplicant = {id: "1", name: "John Doe"};

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockApplicant),
    });

    const result = await getApplicant("1");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/applicant/1`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual(mockApplicant);
  });

  it("should throw error when fetching single applicant fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      getApplicant("1")
    ).rejects.toThrow("Failed to retrieve applicant");
  });

  it("should add a new applicant", async () => {
    const mockLocationHeader = "https://localhost:8081/applicant/2";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: {
        get: () => mockLocationHeader,
      },
    });

    const newApplicant = {name: "Jane Doe", email: "jane@example.com"};
    const result = await addApplicant(newApplicant);

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/applicant`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({id: 0, ...newApplicant}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );

    expect(result).toEqual({id: "2"});
  });

  it("should throw error when adding new applicant fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    const newApplicant = {name: "Jane Doe", email: "jane@example.com"};

    await expect(
      addApplicant(newApplicant)
    ).rejects.toThrow("Failed to add applicant");
  });

  it("should throw error when adding new applicant fails due to missing id in location header", async () => {
    const mockLocationHeader = "https://localhost:8081/applicant/";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: {
        get: () => mockLocationHeader,
      },
    });

    const newApplicant = {name: "Jane Doe", email: "jane@example.com"};

    await expect(
      addApplicant(newApplicant)
    ).rejects.toThrow("Failed to add applicant");
  });

  it("should update an existing applicant", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    const existingApplicant = {name: "Jane Doe", email: "jane@example.com"};
    const result = await updateApplicant("1", existingApplicant);

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/applicant`,
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({id: "1", ...existingApplicant}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );

    expect(result).toEqual(
      {
        data: {
          id: "1",
          ...existingApplicant
        }
      });
  });

  it("should throw error when updating an existing applicant fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    const existingApplicant = {name: "Jane Doe", email: "jane@example.com"};

    await expect(
      updateApplicant("1", existingApplicant)
    ).rejects.toThrow(`Failed to update applicant`);
  });

  it("should delete an applicant", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    const result = await deleteApplicant("135");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/applicant/135`,
      expect.objectContaining({method: "DELETE"})
    );

    expect(result).toBe("Successfully deleted applicant");
  });

  it("should throw error when deleting an existing applicant fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      deleteApplicant("1")
    ).rejects.toThrow(`Failed to delete applicant`);
  });
});

describe('API Functions (invites)', (): void => {
  beforeEach((): void => {
    mockFetch.mockReset();
  });

  it('should invite an applicant to the given assessment', async () => {
    const mockLocationHeader = "https://localhost:8081/invite/cce487c0-9ff7-47a8-9844-b406e046459b";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: {
        get: () => mockLocationHeader,
      },
    });

    const result = await addInvite("1", "1", "2025-01-16T15:13:45.432862Z");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/invite`,
      expect.objectContaining({
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicantId: "1",
          assessmentId: "1",
          expiresAt: "2025-01-16T15:13:45.432862Z"
        }),
      })
    );

    expect(result).toEqual("cce487c0-9ff7-47a8-9844-b406e046459b");
  });

  it("should throw error when invite an applicant to the given assessment fails", async () => {
    const mockLocationHeader = "https://localhost:8081/invite/undefined";
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
      headers: {
        get: () => mockLocationHeader,
      },
    });

    await expect(
      addInvite("1", "1", "2025-01-16T15:13:45.432862Z")
    ).rejects.toThrow("Failed to invite applicant");
  });

  it("should fetch invites", async (): Promise<void> => {
    const mockResponse: { data: InviteInterface[], total: number } = {
      data: [
        {
          id: "cce487c0-9ff7-47a8-9844-b406e046459b",
          applicantId: "90",
          assessmentId: "3",
          status: "not_started",
          invitedAt: "2024-12-30T00:28:25.485108Z",
          expiresAt: "2025-01-06T00:28:25.485108Z",
          measuredSecondsPerSection: []
        },
        {
          id: "a543b334-2873-48b1-b5fb-64e9ab9df87b",
          applicantId: "90",
          assessmentId: "4",
          status: "app_finished",
          invitedAt: "2024-12-30T00:28:25.485638Z",
          expiresAt: "2025-01-06T00:28:25.485638Z",
          measuredSecondsPerSection: []
        },
        {
          id: "be05fc98-06d3-4763-9445-417ac149f90d",
          applicantId: "91",
          assessmentId: "3",
          status: "app_finished",
          invitedAt: "2024-12-30T00:28:25.485638Z",
          expiresAt: "2025-01-06T00:28:25.485638Z",
          measuredSecondsPerSection: []
        }
      ],
      total: 3
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockResponse),
    });

    const result: { data: InviteInterface[], totalItems: number } = await getInvites();

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/invite`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual({
      data: mockResponse.data,
      totalItems: mockResponse.total,
    });
  });

  it("should throw error when fetching invites fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      getInvites()
    ).rejects.toThrow("Failed to retrieve invites");
  });

  it("should fetch a single invite by ID", async () => {
    const mockInvite: InviteInterface = {
      id: "be05fc98-06d3-4763-9445-417ac149f90d",
      applicantId: "91",
      assessmentId: "3",
      status: "app_finished",
      invitedAt: "2024-12-30T00:28:25.485638Z",
      expiresAt: "2025-01-06T00:28:25.485638Z",
      measuredSecondsPerSection: []
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockInvite),
    });

    const result = await getInvite("be05fc98-06d3-4763-9445-417ac149f90d");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/invite/be05fc98-06d3-4763-9445-417ac149f90d`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual(mockInvite);
  });

  it("should throw error when fetching single invite fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      getInvite("be05fc98-06d3-4763-9445-417ac149f90d")
    ).rejects.toThrow("Failed to retrieve invite");
  });

  it("should update an existing invite", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    const existingInvite = {
      status: "app_finished",
      expiresAt: "2025-01-06T00:28:25.485638Z"
    };
    const result = await updateInvite("be05fc98-06d3-4763-9445-417ac149f90d", existingInvite);

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/invite`,
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({id: "be05fc98-06d3-4763-9445-417ac149f90d", ...existingInvite}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );

    expect(result).toEqual(
      {
        data: {
          id: "be05fc98-06d3-4763-9445-417ac149f90d",
          ...existingInvite
        }
      });
  });

  it("should throw error when updating an existing invite fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    const existingInvite = {
      status: "app_finished",
      expiresAt: "2025-01-06T00:28:25.485638Z"
    };

    await expect(
      updateInvite("be05fc98-06d3-4763-9445-417ac149f90d", existingInvite)
    ).rejects.toThrow(`Failed to update invite`);
  });

  it("should delete an invite", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    const result = await deleteInvite("be05fc98-06d3-4763-9445-417ac149f90d");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/invite/be05fc98-06d3-4763-9445-417ac149f90d`,
      expect.objectContaining({method: "DELETE"})
    );

    expect(result).toBe("Successfully deleted invite");
  });

  it("should throw error when deleting an existing invite fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      deleteInvite("be05fc98-06d3-4763-9445-417ac149f90d")
    ).rejects.toThrow(`Failed to delete invite`);
  });
})

describe("API Functions (sendMail)", () => {
  beforeEach((): void => {
    mockFetch.mockReset();
  });

  it("should successfully send a mail request", async () => {
    const mockResponse = {ok: true, statusText: "OK"};

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockResponse),
    });

    const result = await sendMail("applicantId1", "inviteId1", EmailTypes.INVITATION, "Additional message");

    expect(mockFetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_MANAGEMENT_URL}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        applicantId: "applicantId1",
        inviteId: "inviteId1",
        type: EmailTypes.INVITATION,
        additionalMessage: "Additional message",
      }),
    });

    expect(result).toBe("Successfully send email request");
  });

  it("should throw an error if response is not ok", async () => {
    const mockResponse = {ok: false, statusText: "Bad Request"};

    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Bad Request",
      json: createFetchResponse(mockResponse),
    });

    await expect(sendMail("applicantId1", "inviteId1", EmailTypes.INVITATION, "Additional message"))
      .rejects.toThrow("Failed to send email request: Bad Request");

    expect(mockFetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_MANAGEMENT_URL}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        applicantId: "applicantId1",
        inviteId: "inviteId1",
        type: EmailTypes.INVITATION,
        additionalMessage: "Additional message",
      }),
    });
  });
});

describe("API Functions (users)", (): void => {
  beforeEach((): void => {
    mockFetch.mockReset();
  });

  // examples of valid user urls:
  // 1. https://localhost:8081/user returns with sort=name,asc , page=0 and size="all" as standard (not implemented)
  // 2. https://localhost:8081/user?sort=name,asc
  // 3. https://localhost:8081/user?sort=name,desc (same as 2)
  // 4. https://localhost:8081/user?sort=email,asc (same as 2)
  // 5. https://localhost:8081/user?sort=name,asc&sort=email,asc (not implemented)
  // 6. https://localhost:8081/user?sort=name,asc&name=john
  // 7. https://localhost:8081/user?page=0 (not implemented)
  // 8. https://localhost:8081/user?page=0&sort=name,asc (not implemented)
  // 9. https://localhost:8081/user?page=0&size=10&sort=name,asc
  // 10. https://localhost:8081/user?page=0&size=10&sort=name,asc&name=john
  // 11. https://localhost:8081/user?page=0&size=10&sort=name,asc&email=john (same as 10)
  // 12. https://localhost:8081/user?page=0&size=10&sort=name,asc&name=john&email=john (same as 10)

  // examples of invalid user urls:
  // 1. https://localhost:8081/user?page=1 (this will return an empty data set, because everything is on page 0)

  it("(valid 2, 3, 4) should fetch users standard with standard sort", async (): Promise<void> => {
    const mockResponse = {
      data: [{id: "1", name: "John Doe", email: "johndoe@gmail.com"}],
      total: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockResponse),
    });

    const result: { data: UserInterface[], totalItems: number } = await getUsers(0, -1, "", "");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/user?sort=name,asc`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual({
      data: mockResponse.data,
      totalItems: mockResponse.total,
    });
  });

  it("(valid 6) should fetch users with valid page, negative size, sort and query", async (): Promise<void> => {
    const mockResponse = {
      data: [{id: "1", name: "John Doe", email: "johndoe@gmail.com"}],
      total: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockResponse),
    });

    const result: { data: UserInterface[], totalItems: number } = await getUsers(0, -1, "name,asc", "name=john");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/user?sort=name,asc&name=john`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual({
      data: mockResponse.data,
      totalItems: mockResponse.total,
    });
  });

  it("(valid 9) should fetch users with valid page, positive size and sort", async (): Promise<void> => {
    const mockResponse = {
      data: [{id: "1", name: "John Doe", email: "johndoe@gmail.com"}],
      total: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockResponse),
    });

    const result: { data: UserInterface[], totalItems: number } = await getUsers(0, 10, "name,asc", "");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/user?page=0&size=10&sort=name,asc`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual({
      data: mockResponse.data,
      totalItems: mockResponse.total,
    });
  });

  it("(valid 10, 11, 12) should fetch users with valid page, non-negative size, sort and query", async (): Promise<void> => {
    const mockResponse = {
      data: [{id: "1", name: "John Doe", email: "johndoe@gmail.com"}],
      total: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockResponse),
    });

    const result: { data: UserInterface[], totalItems: number } = await getUsers(0, 10, "name,asc", "name=john");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/user?page=0&size=10&sort=name,asc&name=john`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual({
      data: mockResponse.data,
      totalItems: mockResponse.total,
    });
  });

  it("should throw error when fetching users fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      getUsers(1, 10, "name,asc", "")
    ).rejects.toThrow("Failed to retrieve users");
  });

  it("should update an existing user", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    const existingUser = {name: "Jane Doe", email: "jane@example.com"};
    const result = await updateUser("1", existingUser);

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/user`,
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({id: "1", ...existingUser}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );

    expect(result).toEqual(
      {
        data: {
          id: "1",
          ...existingUser
        }
      });
  });

  it("should throw error when updating an existing user fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    const existingUser = {name: "Jane Doe", email: "jane@example.com"};

    await expect(
      updateUser("1", existingUser)
    ).rejects.toThrow(`Failed to update user`);
  });

  it("should throw error when updating an existing user fails because it is the email of the standard admin", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    const existingUser = {name: "Default admin", email: import.meta.env.VITE_DEFAULT_ADMIN_EMAIL};

    await expect(
      updateUser("1", existingUser)
    ).rejects.toThrow(`The standard admin can't be updated`);
  });

  it("should delete an user", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    const result = await deleteUser("135");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/user/135`,
      expect.objectContaining({method: "DELETE"})
    );

    expect(result).toBe("Successfully deleted user");
  });

  it("should throw error when deleting an existing user fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      deleteUser("1")
    ).rejects.toThrow(`Failed to delete user`);
  });

  it("should throw error when deleting an existing user fails when it is the standard admin", async () => {
    await expect(
      deleteUser(import.meta.env.VITE_DEFAULT_ADMIN_ID)
    ).rejects.toThrow("The standard admin can't be deleted");
  })

  it.skip("should throw error when deleting an existing user fails when it is the current user", async () => {
    await expect(
      deleteUser("currentUser")
    ).rejects.toThrow("Can't delete current user");
  })
});

describe("API Functions (assessments)", (): void => {
  beforeEach((): void => {
    mockFetch.mockReset();
  });

  // examples of valid assessment urls:
  // 1. https://localhost:8081/assessment?sort=tag,asc (returns all assessments)
  // 2. https://localhost:8081/assessment?sort=tag,desc (same as 1)
  // 3. https://localhost:8081/assessment?page=0&sort=tag,asc (not implemented)
  // 4. https://localhost:8081/assessment?page=0&size=10&sort=tag,asc

  // examples of invalid assessment urls:
  // 1. https://localhost:8081/assessment?page=0 (this will return an empty data set, because everything is on page 0)
  // 2. https://localhost:8081/assessment
  // 3. query not supported yet by API

  it("(valid 1, 2) should fetch assessments standard with standard sort", async (): Promise<void> => {
    const mockResponse = {
      data: [{id: "1", name: "John Doe", email: "johndoe@gmail.com"}],
      total: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockResponse),
    });

    const result: { data: AssessmentInterface[], totalItems: number } = await getAssessments(0, -1, "", "");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/assessment?sort=tag,asc`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual({
      data: mockResponse.data,
      totalItems: mockResponse.total,
    });
  });

  it("(valid 4) should fetch assessments with valid page, positive size and sort", async (): Promise<void> => {
    const mockResponse = {
      data: [{id: "1", name: "John Doe", email: "johndoe@gmail.com"}],
      total: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockResponse),
    });

    const result: { data: AssessmentInterface[], totalItems: number } = await getAssessments(0, 10, "tag,asc", "");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/assessment?page=0&size=10&sort=tag,asc`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual({
      data: mockResponse.data,
      totalItems: mockResponse.total,
    });
  });

  it("should throw error when fetching assessments fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      getAssessments(0, 10, "tag,asc", "")
    ).rejects.toThrow("Failed to retrieve assessments");
  });

  it("should fetch a single assessment by ID", async () => {
    const mockAssessment: AssessmentInterface = {
      id: "3",
      tag: "JAVA assessment",
      sections: [
        5,
        6
      ]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockAssessment),
    });

    const result: AssessmentInterface = await getAssessment("1");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/assessment/1`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual(mockAssessment);
  });

  it("should throw error when fetching single assessment fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      getAssessment("1")
    ).rejects.toThrow("Failed to retrieve assessment");
  });
});

describe('API Functions (results)', (): void => {
  it("should fetch a single section by ID", async () => {
    const mockSection: SectionInterface = {
      id: "3",
      title: "data",
      assignments: [{
        id: "1",
        type: AssignmentTypes.OPEN,
        isSolved: false,
        description: "How is the hell hound called?"
      }
      ]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockSection),
    });

    const result: SectionInterface = await getSection("1");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/section/1`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual(mockSection);
  });

  it("should throw error when fetching single section fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      getSection("1")
    ).rejects.toThrow("Failed to retrieve section");
  });

  it("should fetch a single section result by ID", async () => {
    const mockSection: SectionSolvedInterface = {
      id: "3",
      title: "data",
      measuredSeconds: 600,
      availableSeconds: 1200,
      scoredPoints: 5,
      availablePoints: 10,
      assignments: [{
        id: "1",
        type: AssignmentTypes.OPEN,
        scoredPoints: 5,
        availablePoints: 10,
        description: "How is the hell hound called?"
      }
      ],
      size: 1
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockSection),
    });

    const result: SectionSolvedInterface = await getSectionResult("1", "cce487c0-9ff7-47a8-9844-b406e046459b");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/section/1/result/cce487c0-9ff7-47a8-9844-b406e046459b`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual(mockSection);
  });

  it("should throw error when fetching single section result fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      getSectionResult("1", "cce487c0-9ff7-47a8-9844-b406e046459b")
    ).rejects.toThrow("Failed to retrieve result of section");
  });

  it("should fetch a single assignment by ID", async () => {
    const mockAssignment: AssignmentInterface = {
      id: "3",
      type: AssignmentTypes.OPEN,
      isSolved: false,
      description: "How is the hell hound called?",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockAssignment),
    });

    const result: AssignmentInterface = await getAssignment("1");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/assignment/1`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual(mockAssignment);
  });

  it("should throw error when fetching single section result fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      getAssignment("1")
    ).rejects.toThrow("Failed to retrieve assignment");
  });

  it("should fetch a single bar chart statistics by ID", async () => {
    const mockSection: BarChartInterface = {
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

    // mockFetch.mockResolvedValueOnce({
    //   ok: true,
    //   json: createFetchResponse(mockSection),
    //   body: JSON.stringify({
    //     inviteId: "cce487c0-9ff7-47a8-9844-b406e046459b",
    //   })
    // });

    const result: BarChartInterface = await getBarChartStats("cce487c0-9ff7-47a8-9844-b406e046459b");

    //TODO: uncomment when correctly implemented
    // expect(mockFetch).toHaveBeenCalledWith(
    //   `${import.meta.env.VITE_API_MANAGEMENT_URL}/statistics`,
    //   expect.objectContaining({method: "GET"})
    // );

    expect(result).toEqual(mockSection);
  });

  it.skip("should throw error when fetching single bar chart statistics fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      getBarChartStats("cce487c0-9ff7-47a8-9844-b406e046459b")
    ).rejects.toThrow("Failed to retrieve bar chart statistics");
  });

  it("should fetch skills", async () => {
    const mockSkills: SkillsInterface[] = [
      {
        title: "data",
        scoredPoints: 5,
        availablePoints: 10
      },
      {
        title: "sql",
        scoredPoints: 9,
        availablePoints: 12
      }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: createFetchResponse(mockSkills),
    });

    const result: SkillsInterface[] = await getSkillsStats("1", "cce487c0-9ff7-47a8-9844-b406e046459b");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/assessment/1/result/cce487c0-9ff7-47a8-9844-b406e046459b`,
      expect.objectContaining({method: "GET"})
    );

    expect(result).toEqual(mockSkills);
  });

  it("should throw error when fetching skills fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      getSkillsStats("1", "cce487c0-9ff7-47a8-9844-b406e046459b")
    ).rejects.toThrow("Failed to retrieve skills");
  });

  it("should update a score of an assignment", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    const result = await updateScoredPointsAssignment("1", 3, "invite123");

    expect(mockFetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_MANAGEMENT_URL}/assignment/1/result/invite123`,
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({id: "1", scoredPoints: 3}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );

    expect(result).toEqual("Successfully updated score");
  });

  it("should throw error when updating an existing applicant fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      updateScoredPointsAssignment("1", 3, "invite123")
    ).rejects.toThrow(`Failed to update scored points for assignment 1`);
  });
});