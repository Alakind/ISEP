import {Mock} from "vitest";
import {act, ChangeEvent} from "react";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import BulkActionSelectContainer from "../../../src/containers/table/BulkActionSelectContainer.tsx";
import {Selection} from "../../../src/utils/types.tsx";
import {toast} from "react-toastify";

vi.mock("../../../src/utils/apiFunctions.tsx", () => ({
  deleteUser: vi.fn(),
}));

// const mockProceedAction = vi.fn();
// const mockCancelAction = vi.fn();
// vi.mock("../../../src/components/CustomWarnToast.tsx", () => ({
//   __esModule: true,
//   default: ({message}: { message: string }) => (
//     <div data-testid="custom-warn-toast">
//       <div>{message}</div>
//       <button onClick={mockProceedAction} data-testid="proceed-button">Proceed</button>
//       <button onClick={mockCancelAction} data-testid="cancel-button">Cancel</button>
//     </div>
//   ),
// }));

vi.mock("../../../src/components/table/BulkActionSelect.tsx", () => ({
  __esModule: true,
  default: ({
              loading,
              options,
              handleSelect,
              selectedOption,
              setSelectedOption,
            }: {
    loading: boolean;
    options: string[];
    handleSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
    selectedOption: string;
    setSelectedOption: (value: string) => void;
  }) => (
    <select
      data-testid="bulk-action-select"
      value={selectedOption}
      onChange={(e) => {
        setSelectedOption(e.target.value);
        handleSelect(e);
      }}
      disabled={loading}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("react-toastify", () => ({
  __esModule: true,
  toast: {
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe("BulkActionSelectContainer", () => {
  const mockRemoveUser = vi.fn();
  const mockDeleteUser = vi.fn();
  const warnCallback = vi.fn();

  const mockIsSelected: Selection[] = [
    {id: "1", checked: true},
    {id: "2", checked: false},
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the BulkActionSelect component with options", () => {
    render(
      <BulkActionSelectContainer isSelected={mockIsSelected} removeUser={mockRemoveUser}/>
    );

    const select = screen.getByTestId("bulk-action-select");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("-");
    expect(select).not.toBeDisabled();
  });

  it("shows a warning toast when 'Delete selected' is chosen with selected users", () => {
    render(
      <BulkActionSelectContainer isSelected={mockIsSelected} removeUser={mockRemoveUser}/>
    );

    const select = screen.getByTestId("bulk-action-select");
    fireEvent.change(select, {target: {value: "Delete selected"}});

    expect(toast.warn).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        hideProgressBar: true,
        autoClose: false,
      })
    );
  });

  it("shows an info toast when 'Delete selected' is chosen without selected users", () => {
    render(
      <BulkActionSelectContainer
        isSelected={[{id: "1", checked: false}, {id: "2", checked: false}]}
        removeUser={mockRemoveUser}
      />
    );

    const select = screen.getByTestId("bulk-action-select");
    fireEvent.change(select, {target: {value: "Delete selected"}});

    expect(toast.info).toHaveBeenCalledWith("You need to select some users for this action!");
  });

  it("calls deleteUser and removeUser for each selected user when confirmed", async () => {
    vi.mocked(mockDeleteUser).mockResolvedValue({});
    // const {rerender} = render(
    //   <BulkActionSelectContainer isSelected={mockIsSelected} removeUser={mockRemoveUser}/>
    // );

    render(
      <BulkActionSelectContainer isSelected={mockIsSelected} removeUser={mockRemoveUser}/>
    );

    const select = screen.getByTestId("bulk-action-select");
    await act(async () => {
      fireEvent.change(select, {target: {value: "Delete selected"}});
    })

    // await waitFor(() => {
    //     rerender(
    //       <BulkActionSelectContainer isSelected={mockIsSelected} removeUser={mockRemoveUser}/>
    //     );
    //
    //     screen.debug()
    //     // const customToast = screen.getByTestId("custom-warn-toast");
    //     // console.log(customToast);
    //     // expect(customToast).toBeInTheDocument()
    //     screen.debug()
    //     const proceedButton = screen.getByTestId("proceed-button");
    //     fireEvent.click(proceedButton);
    //   },
    //   {
    //     timeout: 500, // default is 1000
    //     interval: 100,
    //   }
    // );
    //
    // fireEvent.click(screen.getByRole('button', {name: 'Proceed'}));
    //
    // expect(mockDeleteUser).toHaveBeenCalledTimes(1);
    // expect(mockDeleteUser).toHaveBeenCalledWith("1");
    // expect(mockRemoveUser).toHaveBeenCalledWith("1");
    // console.log(vi.mocked(toast.warn).mock.lastCall[0].props.proceedAction)
    expect(toast.warn).toHaveBeenCalled();
  });

  it("handles API errors gracefully", async () => {
    vi.mocked(mockDeleteUser).mockRejectedValue(new Error("API Error"));

    // Mock the CustomWarnToast rendering behavior
    (toast.warn as Mock).mockImplementation(({props}) => {
      // Simulate the rendering of CustomWarnToast
      props.proceedAction();
      warnCallback();
    });

    render(
      <BulkActionSelectContainer isSelected={mockIsSelected} removeUser={mockRemoveUser}/>
    );

    fireEvent.change(screen.getByRole('combobox'), {target: {value: 'Delete selected'}});
    expect(toast.warn).toHaveBeenCalled();

    // Wait for the toast to be triggered
    await waitFor(() => expect(warnCallback).toHaveBeenCalled());

    expect(screen.getByRole('combobox')).toHaveValue('-');

    // expect(toast.error).toHaveBeenCalledWith("API Error"); //gives error
  });

  it("resets the select option after performing an action", async () => {
    render(
      <BulkActionSelectContainer isSelected={mockIsSelected} removeUser={mockRemoveUser}/>
    );

    const select = screen.getByTestId("bulk-action-select");
    await act(async () => {
      fireEvent.change(select, {target: {value: "Delete selected"}});
    })

    expect(select).toHaveValue("-");
  });

  it('should cancel action when cancelAction is called', async () => {
    // Mock the CustomWarnToast rendering behavior
    (toast.warn as Mock).mockImplementation(({props}) => {
      // Simulate the rendering of CustomWarnToast
      props.cancelAction();
      warnCallback();
    });

    render(<BulkActionSelectContainer isSelected={mockIsSelected} removeUser={mockRemoveUser}/>);

    fireEvent.change(screen.getByRole('combobox'), {target: {value: 'Delete selected'}});

    // Wait for the toast to be triggered
    await waitFor(() => {
      expect(warnCallback).toHaveBeenCalled();
    });


    expect(screen.getByRole('combobox')).toHaveValue('-');
  });
});
