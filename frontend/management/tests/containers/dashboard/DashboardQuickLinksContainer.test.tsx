import {render, screen} from "@testing-library/react";
import DashboardQuickLinksContainer from "../../../src/containers/dashboard/DashboardQuickLinksContainer.tsx";

vi.mock("../../../src/components/dashboard/DashboardQuickLinks.tsx", () => {
  return {
    __esModule: true,
    default: vi.fn(() => <div>Mocked DashboardQuickLinks</div>),
  };
});

describe("DashboardQuickLinksContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the DashboardQuickLinks component", () => {
    render(<DashboardQuickLinksContainer/>);

    expect(screen.getByText("Mocked DashboardQuickLinks")).toBeInTheDocument();
  });
});
