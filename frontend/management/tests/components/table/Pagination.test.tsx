import Pagination from "../../../src/components/table/Pagination.tsx";
import {fireEvent, render, screen} from "@testing-library/react";

describe("Pagination Component", () => {
  const mockHandleClick = vi.fn();

  const defaultProps = {
    pageNumbers: Array.from({length: 10}, (_, i) => i),
    itemsPerPage: 10,
    lastPage: 9,
    currentPage: 0,
    handleClick: mockHandleClick,
  };

  it("renders the previous and next buttons", () => {
    render(<Pagination {...defaultProps} />);

    const prevButton = screen.getAllByRole("button", {name: ""})[0];
    const nextButton = screen.getAllByRole("button", {name: ""})[1];

    expect(prevButton).toBeInTheDocument();
    expect(prevButton.firstChild).toHaveClass("bi-caret-left");
    expect(nextButton).toBeInTheDocument();
    expect(nextButton.firstChild).toHaveClass("bi-caret-right");
  });

  it("disables the previous button on the first page", () => {
    render(<Pagination {...defaultProps} currentPage={0}/>);

    const prevButton = screen.getAllByRole("button", {name: ""})[0];
    expect(prevButton.parentElement).toHaveClass("disabled");
  });

  it("disables the next button on the last page", () => {
    render(<Pagination {...defaultProps} currentPage={9}/>);

    const nextButton = screen.getAllByRole("button", {name: ""})[1];
    expect(nextButton.parentElement).toHaveClass("disabled");
  });

  it("calls handleClick with the correct arguments when previous button is clicked", () => {
    render(<Pagination {...defaultProps} currentPage={5}/>);

    const prevButton = screen.getAllByRole("button", {name: ""})[0];
    fireEvent.click(prevButton);

    expect(mockHandleClick).toHaveBeenCalledWith(expect.anything(), 4);
  });

  it("calls handleClick with the correct arguments when next button is clicked", () => {
    render(<Pagination {...defaultProps} currentPage={5}/>);

    const nextButton = screen.getAllByRole("button", {name: ""})[1];
    fireEvent.click(nextButton);

    expect(mockHandleClick).toHaveBeenCalledWith(expect.anything(), 6);
  });

  it("renders all pages when lastPage is less than or equal to 6", () => {
    render(<Pagination {...defaultProps} pageNumbers={Array.from({length: 5}, (_, i) => i)} lastPage={5}/>);

    const pageButtons = screen.getAllByRole("button");
    expect(pageButtons).toHaveLength(7); // 5 pages + prev + next

    const allButtons = screen.getAllByTestId("pagination-all-item");
    expect(allButtons).toHaveLength(5);
  });

  it("renders left, center, or right pagination based on the current page", () => {
    render(<Pagination {...defaultProps} currentPage={0}/>);
    expect(screen.getAllByTestId("pagination-left-item")).toHaveLength(7);

    render(<Pagination {...defaultProps} currentPage={5}/>);
    expect(screen.getAllByTestId("pagination-center-item")).toHaveLength(7);

    render(<Pagination {...defaultProps} currentPage={9}/>);
    expect(screen.getAllByTestId("pagination-right-item")).toHaveLength(7);
  });

  it("renders ellipses for large page numbers", () => {
    render(<Pagination {...defaultProps} lastPage={20} currentPage={10}/>);

    const ellipses = screen.getAllByText("...");
    expect(ellipses).toHaveLength(2);
  });
});