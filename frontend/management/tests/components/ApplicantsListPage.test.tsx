import {fireEvent, render, screen} from "@testing-library/react";
import {ApplicantInterface} from "../../src/utils/types.tsx";
import ApplicantsListPage from "../../src/components/ApplicantsListPage.tsx";
import {MemoryRouter} from "react-router-dom";

describe('ApplicantsListPage Component', () => {
  const mockHandleAddApplicant = vi.fn();
  const mockSetCurrentPage = vi.fn();
  const mockSetItemsPerPage = vi.fn();
  const mockSetOrderBy = vi.fn();
  const mockSetQuery = vi.fn();


  const mockData: ApplicantInterface[] = [
    {id: '1', name: 'Applicant 1', email: 'applicant1@example.com', score: 85, preferredLanguage: "Kotlin", statuses: [], invites: []},
    {id: '2', name: 'Applicant 2', email: 'applicant2@example.com', score: 90, preferredLanguage: "Kotlin", statuses: [], invites: []},
  ];

  it('renders the loading state when loading is true', () => {
    render(
      <ApplicantsListPage
        handleAddApplicant={mockHandleAddApplicant}
        data={[]}
        totalItems={0}
        loading={true}
        currentPage={1}
        setCurrentPage={mockSetCurrentPage}
        itemsPerPage={10}
        setItemsPerPage={mockSetItemsPerPage}
        orderBy="name"
        setOrderBy={mockSetOrderBy}
        setQuery={mockSetQuery}
      />
    );

    expect(screen.getByTestId('table-loading')).toBeInTheDocument();
  });

  it('renders the applicants table when data is available', () => {
    render(
      <MemoryRouter>
        <ApplicantsListPage
          handleAddApplicant={mockHandleAddApplicant}
          data={mockData}
          totalItems={2}
          loading={false}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          itemsPerPage={10}
          setItemsPerPage={mockSetItemsPerPage}
          orderBy="name"
          setOrderBy={mockSetOrderBy}
          setQuery={mockSetQuery}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('applicants-table')).toBeInTheDocument();
    expect(screen.getByText('Applicant 1')).toBeInTheDocument();
    expect(screen.getByText('Applicant 2')).toBeInTheDocument();
  });

  it('calls handleAddApplicant when the "Add applicant" button is clicked', () => {
    render(
      <MemoryRouter>
        <ApplicantsListPage
          handleAddApplicant={mockHandleAddApplicant}
          data={mockData}
          totalItems={2}
          loading={false}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          itemsPerPage={10}
          setItemsPerPage={mockSetItemsPerPage}
          orderBy="name"
          setOrderBy={mockSetOrderBy}
          setQuery={mockSetQuery}
        />
      </MemoryRouter>
    );

    const addButton = screen.getByText('Add applicant');
    fireEvent.click(addButton);

    expect(mockHandleAddApplicant).toHaveBeenCalled();
  });

  it('updates query when search input changes', () => {
    render(
      <MemoryRouter>
        <ApplicantsListPage
          handleAddApplicant={mockHandleAddApplicant}
          data={mockData}
          totalItems={2}
          loading={false}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          itemsPerPage={10}
          setItemsPerPage={mockSetItemsPerPage}
          orderBy="name"
          setOrderBy={mockSetOrderBy}
          setQuery={mockSetQuery}
        />
      </MemoryRouter>
    );

    const searchInput = screen.getByRole('textbox', {name: 'Search'});
    fireEvent.change(searchInput, {target: {value: 'test'}});

    expect(mockSetQuery).toHaveBeenCalledWith('name=test');
  });

  it('changes the items per page when the select value changes', () => {
    render(
      <MemoryRouter>
        <ApplicantsListPage
          handleAddApplicant={mockHandleAddApplicant}
          data={mockData}
          totalItems={2}
          loading={false}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          itemsPerPage={10}
          setItemsPerPage={mockSetItemsPerPage}
          orderBy="name"
          setOrderBy={mockSetOrderBy}
          setQuery={mockSetQuery}
        />
      </MemoryRouter>
    );

    const itemsPerPageSelect = screen.getByLabelText(/Items per page:/i);
    fireEvent.change(itemsPerPageSelect, {target: {value: '25'}});

    expect(mockSetItemsPerPage).toHaveBeenCalledWith(25);
  });

  it('navigates between pages using the pagination component', () => {
    render(
      <MemoryRouter>
        <ApplicantsListPage
          handleAddApplicant={mockHandleAddApplicant}
          data={mockData}
          totalItems={2}
          loading={false}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          itemsPerPage={10}
          setItemsPerPage={mockSetItemsPerPage}
          orderBy="name"
          setOrderBy={mockSetOrderBy}
          setQuery={mockSetQuery}
        />
      </MemoryRouter>
    );

    const nextButton = screen.getAllByRole('button', {name: ''})[2];
    fireEvent.click(nextButton);

    expect(mockSetCurrentPage).toHaveBeenCalledWith(2);
  });
});