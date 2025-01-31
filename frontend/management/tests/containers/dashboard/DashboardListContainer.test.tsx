import {render, screen, waitFor} from "@testing-library/react";
import {toast} from "react-toastify";
import {getApplicants, getInvites} from "../../../src/utils/apiFunctions.tsx";
import DashboardListContainer from "../../../src/containers/dashboard/DashboardListContainer.tsx";
import {expect} from "vitest";
import {mapStatus} from "../../../src/utils/mapping.tsx";
import {InviteDateAttributes, InviteStatuses} from "../../../src/utils/constants.tsx";
import {formatDate} from "../../../src/utils/general.tsx";

vi.mock("../../../src/components/dashboard/DashboardList.tsx", () => {
  return {
    __esModule: true,
    default: vi.fn(() => <div>Mocked DashboardList</div>),
  };
});

vi.mock("../../../src/utils/apiFunctions.tsx", () => {
  return {
    getApplicants: vi.fn(),
    getInvites: vi.fn(),
  };
});

vi.mock("react-toastify", () => {
  return {
    toast: {
      error: vi.fn(),
    },
  };
});

describe("DashboardListContainer", () => {
  const mockSetTotalApplicants = vi.fn();
  const mockSetTotalWillExpire = vi.fn();
  const mockSetTotalExpired = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the DashboardList component", async () => {
    vi.mocked(getApplicants).mockResolvedValue({data: [], totalItems: 0});
    vi.mocked(getInvites).mockResolvedValue({data: [], totalItems: 0});

    render(
      <DashboardListContainer
        setTotalApplicants={mockSetTotalApplicants}
        setTotalWillExpire={mockSetTotalWillExpire}
        setTotalExpired={mockSetTotalExpired}
      />
    );

    expect(screen.getByText("Mocked DashboardList")).toBeInTheDocument();

    await waitFor(() => {
      expect(getApplicants).toHaveBeenCalledTimes(1);
      expect(getInvites).toHaveBeenCalledTimes(3);
    });

    await waitFor(() => {
      expect(mockSetTotalApplicants).toHaveBeenCalledWith(0);
      expect(mockSetTotalWillExpire).toHaveBeenCalledWith(0);
      expect(mockSetTotalExpired).toHaveBeenCalledWith(0);
    });
  });

  it("should call the api endpoints correctly", async () => {
    const today = new Date();
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const sevenDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const comingTwoDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);


    vi.mocked(getApplicants).mockResolvedValue({data: [], totalItems: 0});
    vi.mocked(getInvites).mockResolvedValue({data: [], totalItems: 0});

    render(
      <DashboardListContainer
        setTotalApplicants={mockSetTotalApplicants}
        setTotalWillExpire={mockSetTotalWillExpire}
        setTotalExpired={mockSetTotalExpired}
      />
    );

    expect(screen.getByText("Mocked DashboardList")).toBeInTheDocument();

    await waitFor(() => {
      expect(getApplicants).toHaveBeenCalledTimes(1);
      expect(getApplicants).toHaveBeenCalledWith(0, -1, "", "");
      expect(getInvites).toHaveBeenCalledTimes(3);
      expect(getInvites).toHaveBeenCalledWith(mapStatus(InviteStatuses.APP_FINISHED), InviteDateAttributes.ASSESSMENT_FINISHED_AT, formatDate(sevenDaysAgo), undefined, "assessmentFinishedAt,desc");
      expect(getInvites).toHaveBeenCalledWith(mapStatus(InviteStatuses.EXPIRED));
      expect(getInvites).toHaveBeenCalledWith(undefined, InviteDateAttributes.EXPIRES_AT, formatDate(tomorrow), formatDate(comingTwoDays));
    });
  });

  it("should handle API errors gracefully", async () => {
    const errorMessage = "Failed to fetch data";
    vi.mocked(getApplicants).mockRejectedValue(new Error(errorMessage));

    render(
      <DashboardListContainer
        setTotalApplicants={mockSetTotalApplicants}
        setTotalWillExpire={mockSetTotalWillExpire}
        setTotalExpired={mockSetTotalExpired}
      />
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it("should handle API errors gracefully (unknown error)", async () => {
    vi.mocked(getApplicants).mockRejectedValue(null);

    render(
      <DashboardListContainer
        setTotalApplicants={mockSetTotalApplicants}
        setTotalWillExpire={mockSetTotalWillExpire}
        setTotalExpired={mockSetTotalExpired}
      />
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Unknown error occurred.");
    });
  });
});
