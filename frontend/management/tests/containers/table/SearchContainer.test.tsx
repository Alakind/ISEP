import {fireEvent, render, screen} from "@testing-library/react";
import SearchContainer from "../../../src/containers/table/SearchContainer.tsx";
import {beforeEach} from "vitest";

describe("SearchContainer", () => {
  const mockSetQuery = vi.fn();

  beforeEach(
    mockSetQuery.mockReset()
  )

  it("renders the Search component", () => {
    render(<SearchContainer setQuery={mockSetQuery}/>);

    expect(screen.getByTestId("search")).toBeInTheDocument();
    expect(screen.getByTestId("search-select")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("search-button")).toBeInTheDocument();
  });

  it("updates the query when searchKeyword changes", () => {
    render(<SearchContainer setQuery={mockSetQuery}/>);

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, {target: {value: "test"}});

    expect(mockSetQuery).toHaveBeenCalledWith("name=test");
  });

  it("updates the query when the select option changes", () => {
    render(<SearchContainer setQuery={mockSetQuery}/>);

    const selectElement = screen.getByTestId("search-select");
    fireEvent.change(selectElement, {target: {value: "email"}});

    expect(mockSetQuery).toHaveBeenCalledWith("email=");
  });

  it("clears the search keyword and query when the clear button is clicked", () => {
    render(<SearchContainer setQuery={mockSetQuery}/>);

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, {target: {value: "test"}});
    
    const clearButton = screen.getByTestId("search-clear-button");
    fireEvent.click(clearButton);

    expect(mockSetQuery).toHaveBeenCalledWith("");
  });

  it("creates a combined query when the 'both' option is selected", () => {
    render(<SearchContainer setQuery={mockSetQuery}/>);

    const selectElement = screen.getByTestId("search-select");
    const searchInput = screen.getByTestId("search-input");

    fireEvent.change(selectElement, {target: {value: "both"}});
    fireEvent.change(searchInput, {target: {value: "test"}});

    expect(mockSetQuery).toHaveBeenCalledWith("name=test&email=test");
  });
});