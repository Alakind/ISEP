import {fireEvent, render, screen} from "@testing-library/react";
import PaginationAll from "../../../src/components/table/PaginationAll.tsx";
import {expect} from "vitest";

describe("PaginationAll Component", () => {
  const mockHandleClick = vi.fn();

  const defaultProps = {
    pageNumbers: [0, 1, 2, 3, 4],
    lastPage: 9,
    currentPage: 0,
    handleClick: mockHandleClick,
  };

  it("renders no ellipsis", () => {
    render(<PaginationAll {...defaultProps} />);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).not.toHaveTextContent("...")
    })
  });

  it("renders all page buttons", () => {
    render(<PaginationAll {...defaultProps} />);

    const allButtons = screen.getAllByRole("button");
    expect(allButtons).toHaveLength(5);
    expect(allButtons.map((button) => button.textContent)).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("sets the active class on the third page", () => {
    render(<PaginationAll {...defaultProps} currentPage={2}/>);

    const activeButton = screen.getByRole("button", {name: "3"});
    expect(activeButton.parentElement).toHaveClass("active");
  });

  it("calls handleClick when a page button is clicked", () => {
    render(<PaginationAll {...defaultProps} />);

    const button = screen.getByRole("button", {name: "2"});
    fireEvent.click(button);

    expect(mockHandleClick).toHaveBeenCalledWith(expect.anything(), 1);
    mockHandleClick.mockReset();
  });
});