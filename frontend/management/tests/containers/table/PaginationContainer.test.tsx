import PaginationContainer from "../../../src/containers/table/PaginationContainer.tsx";
import {fireEvent, render, screen} from "@testing-library/react";

const mockSetCurrentPage = vi.fn();

describe('PaginationContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render pagination with the correct number of pages', () => {
    const totalItems = 50;
    const itemsPerPage = 10;

    render(
      <PaginationContainer
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        currentPage={0}
        setCurrentPage={mockSetCurrentPage}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(Math.ceil(totalItems / itemsPerPage) + 2); // prev + 5 pages + next
    expect(buttons[1].textContent).toBe('1');
    expect(buttons[5].textContent).toBe('5');
  });

  it('should render a single page if itemsPerPage is -1', () => {
    const totalItems = 50;
    const itemsPerPage = -1;

    render(
      <PaginationContainer
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        currentPage={0}
        setCurrentPage={mockSetCurrentPage}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1 + 2); // prev + page + next
    expect(buttons[1].textContent).toBe('1');
  });

  it('should call setCurrentPage with the correct page number when a button is clicked', () => {
    const totalItems = 50;
    const itemsPerPage = 10;

    render(
      <PaginationContainer
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        currentPage={0}
        setCurrentPage={mockSetCurrentPage}
      />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);

    expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
  });

  it('should correctly indicate the current page', () => {
    const totalItems = 50;
    const itemsPerPage = 10;
    const currentPage = 2;

    render(
      <PaginationContainer
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        currentPage={currentPage}
        setCurrentPage={mockSetCurrentPage}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button, index) => {
      if (index === currentPage + 1) {
        expect(button.parentElement).toHaveClass('active');
      } else {
        expect(button.parentElement).not.toHaveClass('active');
      }
    });
  });

  it('should handle edge cases with no items', () => {
    const totalItems = 0;
    const itemsPerPage = 10;

    render(
      <PaginationContainer
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        currentPage={0}
        setCurrentPage={mockSetCurrentPage}
      />
    );

    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(buttons[1].textContent).toBe('1');
  });
});