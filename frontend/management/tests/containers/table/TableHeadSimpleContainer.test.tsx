import {render, screen} from "@testing-library/react";
import TableHeadSimpleContainer from "../../../src/containers/table/TableHeadSimpleContainer.tsx";

vi.mock("../../../src/components/table/loading/TableHeadLoading.tsx", () => {
  return {
    __esModule: true,
    default: vi.fn(() => <div>Mocked TableHeadLoading</div>),
  };
});

describe("TableHeadSimpleContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the TableHeadSimpleContainer component", () => {
    render(<TableHeadSimpleContainer columns={[]}/>);

    expect(screen.getByText("Mocked TableHeadLoading")).toBeInTheDocument();
  });
});
