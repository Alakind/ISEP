import {fireEvent, render, screen} from "@testing-library/react";
import {Roles} from "../../src/utils/constants.tsx";
import RoleSelect from "../../src/components/RoleSelect.tsx";

describe("RoleSelect", () => {
  it("should render correctly with a selected option", () => {
    render(
      <RoleSelect
        id={"test"}
        selectedOption={Roles.ADMIN}
        handleSelect={() => {
        }}
        disabled={false}
      />
    );

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveValue(Roles.ADMIN.toString());
  })

  it('should render disabled state correctly', () => {
    render(
      <RoleSelect
        id="test"
        selectedOption={Roles.RECRUITER}
        handleSelect={() => {
        }}
        disabled={true}
      />
    );

    const disabledSpan = screen.getByText(Roles.RECRUITER.toString());
    expect(disabledSpan).toBeInTheDocument();
    expect(disabledSpan).toHaveClass('dropdown__select--disabled');
  });

  it('should call handleSelect when an option is selected', () => {
    const mockHandleSelect = vi.fn();
    render(
      <RoleSelect
        id="test"
        selectedOption={Roles.NO_ACCESS}
        handleSelect={mockHandleSelect}
        disabled={false}
      />
    );

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, {target: {value: Roles.ADMIN.toString()}});

    expect(mockHandleSelect).toHaveBeenCalled();
    expect(mockHandleSelect).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({value: Roles.ADMIN.toString()}),
    }));
  });

  it('should render all role options', () => {
    render(
      <RoleSelect
        id="test"
        selectedOption={Roles.NO_ACCESS}
        handleSelect={() => {
        }}
        disabled={false}
      />
    );

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(Object.keys(Roles).length);
    expect(options.map(option => option.innerHTML)).toEqual([
      Roles.NO_ACCESS.toString(),
      Roles.ADMIN.toString(),
      Roles.RECRUITER.toString(),
      Roles.INTERVIEWER.toString(),
    ]);
  });

  it('displays dash string when no selected option is provided', () => {
    render(
      <RoleSelect
        id="test"
        selectedOption={undefined}
        handleSelect={() => {
        }}
        disabled={false}
      />
    );

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveValue('-');
  });

  it('displays dash string when no selected option is provided when disabled', () => {
    render(
      <RoleSelect
        id="test"
        selectedOption={undefined}
        handleSelect={() => {
        }}
        disabled={true}
      />
    );
    
    const disabledSpan = document.querySelector('span.dropdown__select');
    expect(disabledSpan).toBeInTheDocument();
    expect(disabledSpan).toHaveClass('dropdown__select--disabled');
    expect(disabledSpan).toHaveTextContent('-');
  });

})