import Search from "../../../src/components/table/Search.tsx";
import {fireEvent, render, screen} from "@testing-library/react";

describe("Search Component", () => {
  const mockSetSearchKeyword = vi.fn();
  const mockClearSearch = vi.fn();
  const mockHandleSelect = vi.fn();

  const defaultProps = {
    searchKeyword: "",
    setSearchKeyword: mockSetSearchKeyword,
    clearSearch: mockClearSearch,
    selectedOption: "name",
    handleSelect: mockHandleSelect,
  };

  it("renders the search input and dropdown", () => {
    render(<Search {...defaultProps} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("name");

    const input = screen.getByRole("textbox", {name: "Search"});
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("renders the search button when no keyword is present", () => {
    render(<Search {...defaultProps} />);

    const searchButton = screen.getByTestId("search-button");
    expect(searchButton).toBeInTheDocument();
    expect(searchButton).toHaveClass("btn--search");
  });

  it("renders the clear button when a keyword is present", () => {
    render(<Search {...defaultProps} searchKeyword="test"/>);

    const clearButton = screen.getByTestId("search-clear-button");
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveClass("btn--cancel");
  });

  it("calls setSearchKeyword on input change", () => {
    render(<Search {...defaultProps} />);

    const input = screen.getByRole("textbox", {name: "Search"});
    fireEvent.change(input, {target: {value: "test"}});

    expect(mockSetSearchKeyword).toHaveBeenCalledWith("test");
  });

  it("calls clearSearch when the clear button is clicked", () => {
    render(<Search {...defaultProps} searchKeyword="test"/>);

    const clearButton = screen.getByTestId("search-clear-button");
    fireEvent.click(clearButton);

    expect(mockClearSearch).toHaveBeenCalled();
  });

  it("calls handleSelect when the dropdown value changes", () => {
    render(<Search {...defaultProps} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, {target: {value: "email"}});

    expect(mockHandleSelect).toHaveBeenCalled();
    expect(mockHandleSelect.mock.calls[0][0].target.value).toBe("email");
  });
});