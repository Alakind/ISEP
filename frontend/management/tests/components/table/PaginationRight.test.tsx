import {fireEvent, render, screen} from "@testing-library/react";
import PaginationRight from "../../../src/components/table/PaginationRight.tsx";
import {expect} from "vitest";

describe("PaginationRight Component", () => {
  const mockHandleClick = vi.fn();

  const defaultProps = {
    pageNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    lastPage: 9,
    currentPage: 8,
    handleClick: mockHandleClick,
  };

  it("renders the first page button and ellipsis", () => {
    render(<PaginationRight {...defaultProps} />);

    const firstPageButton = screen.getByRole("button", {name: "1"});
    const ellipsis = screen.getByText("...");

    expect(firstPageButton).toBeInTheDocument();
    expect(firstPageButton).toHaveClass("page-link--mod");
    expect(ellipsis).toBeInTheDocument();
    expect(ellipsis.parentElement).toHaveClass("disabled");
  });

  it("renders the last five page buttons", () => {
    render(<PaginationRight {...defaultProps} />);

    const lastFiveButtons = screen.getAllByRole("button").slice(-5);
    expect(lastFiveButtons).toHaveLength(5);
    expect(lastFiveButtons.map((button) => button.textContent)).toEqual(["6", "7", "8", "9", "10"]);
  });

  it("sets the active class on the first page", () => {
    render(<PaginationRight {...defaultProps} currentPage={0}/>);

    const activeButton = screen.getByRole("button", {name: "1"});
    expect(activeButton.parentElement).toHaveClass("active");
  });

  it("sets the active class on the current page", () => {
    render(<PaginationRight {...defaultProps} currentPage={9}/>);

    const activeButton = screen.getByRole("button", {name: "10"});
    expect(activeButton.parentElement).toHaveClass("active");
  });

  it("calls handleClick when first page button is clicked", () => {
    render(<PaginationRight {...defaultProps} />);

    const button = screen.getByRole("button", {name: "1"});
    fireEvent.click(button);

    expect(mockHandleClick).toHaveBeenCalledWith(expect.anything(), 0);
    mockHandleClick.mockReset();
  });

  it("calls handleClick when a page button is clicked", () => {
    render(<PaginationRight {...defaultProps} />);

    const button = screen.getByRole("button", {name: "9"});
    fireEvent.click(button);

    expect(mockHandleClick).toHaveBeenCalledWith(expect.anything(), 8);
    mockHandleClick.mockReset();
  });

  it("does not call handleClick when the ellipsis is clicked", () => {
    render(<PaginationRight {...defaultProps} />);

    const ellipsis = screen.getByText("...");
    fireEvent.click(ellipsis);

    expect(mockHandleClick).not.toHaveBeenCalled();
  });
});