import {fireEvent, render, screen} from "@testing-library/react";
import PaginationLeft from "../../../src/components/table/PaginationLeft.tsx";
import {expect} from "vitest";

describe("PaginationLeft Component", () => {
  const mockHandleClick = vi.fn();

  const defaultProps = {
    pageNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    lastPage: 9,
    currentPage: 0,
    handleClick: mockHandleClick,
  };

  it("renders the last page button and ellipsis", () => {
    render(<PaginationLeft {...defaultProps} />);

    const firstPageButton = screen.getByRole("button", {name: "10"});
    const ellipsis = screen.getByText("...");

    expect(firstPageButton).toBeInTheDocument();
    expect(firstPageButton).toHaveClass("page-link--mod");
    expect(ellipsis).toBeInTheDocument();
    expect(ellipsis.parentElement).toHaveClass("disabled");
  });

  it("renders the first five page buttons", () => {
    render(<PaginationLeft {...defaultProps} />);

    const firstFiveButtons = screen.getAllByRole("button").splice(0, 5);
    expect(firstFiveButtons).toHaveLength(5);
    expect(firstFiveButtons.map((button) => button.textContent)).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("sets the active class on the current page", () => {
    render(<PaginationLeft {...defaultProps} currentPage={2}/>);

    const activeButton = screen.getByRole("button", {name: "3"});
    expect(activeButton.parentElement).toHaveClass("active");
  });

  it("sets the active class on the last page", () => {
    render(<PaginationLeft {...defaultProps} currentPage={9}/>);

    const activeButton = screen.getByRole("button", {name: "10"});
    expect(activeButton.parentElement).toHaveClass("active");
  });

  it("calls handleClick when a page button is clicked", () => {
    render(<PaginationLeft {...defaultProps} />);

    const button = screen.getByRole("button", {name: "2"});
    fireEvent.click(button);

    expect(mockHandleClick).toHaveBeenCalledWith(expect.anything(), 1);
    mockHandleClick.mockReset();
  });

  it("calls handleClick when last page button is clicked", () => {
    render(<PaginationLeft {...defaultProps} />);

    const button = screen.getByRole("button", {name: "10"});
    fireEvent.click(button);

    expect(mockHandleClick).toHaveBeenCalledWith(expect.anything(), 9);
    mockHandleClick.mockReset();
  });

  it("does not call handleClick when the ellipsis is clicked", () => {
    render(<PaginationLeft {...defaultProps} />);

    const ellipsis = screen.getByText("...");
    fireEvent.click(ellipsis);

    expect(mockHandleClick).not.toHaveBeenCalled();
  });
});