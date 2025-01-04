import {fireEvent, render, screen} from "@testing-library/react";
import PaginationCenter from "../../../src/components/table/PaginationCenter.tsx";
import {expect} from "vitest";

describe("PaginationCenter Component", () => {
  const mockHandleClick = vi.fn();

  const defaultProps = {
    pageNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    lastPage: 9,
    currentPage: 5,
    handleClick: mockHandleClick,
  };

  it("renders the first and last page button and ellipsis", () => {
    render(<PaginationCenter {...defaultProps} />);

    const firstPageButton = screen.getByRole("button", {name: "1"});
    const lastPageButton = screen.getByRole("button", {name: "10"});
    const ellipsis = screen.getAllByText("...");
    expect(ellipsis).toHaveLength(2);

    expect(firstPageButton).toBeInTheDocument();
    expect(firstPageButton).toHaveClass("page-link--mod");
    expect(lastPageButton).toBeInTheDocument();
    expect(lastPageButton).toHaveClass("page-link--mod");

    ellipsis.map((el) => {
      expect(el).toBeInTheDocument();
      expect(el.parentElement).toHaveClass("disabled");
    })

  });

  it("renders the center three page buttons", () => {
    render(<PaginationCenter {...defaultProps} />);

    const centerButtons = screen.getAllByRole("button").splice(2, 3);
    expect(centerButtons).toHaveLength(3);
    expect(centerButtons.map((button) => button.textContent)).toEqual(["5", "6", "7"]);
  });

  it("sets the active class on the first page", () => {
    render(<PaginationCenter {...defaultProps} currentPage={0}/>);
    
    const activeButton = screen.getAllByRole("button", {name: "1"})[0];
    expect(activeButton.parentElement).toHaveClass("active");
  });

  it("sets the active class on the current page", () => {
    render(<PaginationCenter {...defaultProps} currentPage={6}/>);

    const activeButton = screen.getByRole("button", {name: "7"});
    expect(activeButton.parentElement).toHaveClass("active");
  });

  it("sets the active class on the last page", () => {
    render(<PaginationCenter {...defaultProps} currentPage={9}/>);

    const activeButton = screen.getAllByRole("button", {name: "10"})[1];
    expect(activeButton.parentElement).toHaveClass("active");
  });

  it("calls handleClick when first page button is clicked", () => {
    render(<PaginationCenter {...defaultProps} />);

    const button = screen.getAllByRole("button", {name: "1"})[0];
    fireEvent.click(button);

    expect(mockHandleClick).toHaveBeenCalledWith(expect.anything(), 0);
    mockHandleClick.mockReset();
  });

  it("calls handleClick when a page button is clicked", () => {
    render(<PaginationCenter {...defaultProps} />);

    const button = screen.getByRole("button", {name: "6"});
    fireEvent.click(button);

    expect(mockHandleClick).toHaveBeenCalledWith(expect.anything(), 5);
    mockHandleClick.mockReset();
  });

  it("calls handleClick when last page button is clicked", () => {
    render(<PaginationCenter {...defaultProps} />);

    const button = screen.getByRole("button", {name: "10"});
    fireEvent.click(button);

    expect(mockHandleClick).toHaveBeenCalledWith(expect.anything(), 9);
    mockHandleClick.mockReset();
  });

  it("does not call handleClick when the ellipsis is clicked", () => {
    render(<PaginationCenter {...defaultProps} />);

    const ellipsis = screen.getAllByText("...");
    ellipsis.map((el) => {
      fireEvent.click(el);

      expect(mockHandleClick).not.toHaveBeenCalled();
      mockHandleClick.mockReset();
    })
  });
});