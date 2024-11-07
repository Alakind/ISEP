import { AssignmentTypes, AssignmentTypesBackend } from "./constants";

export function AssignmentTypesFromBackend(typeBackend: string) {
  if (typeBackend == AssignmentTypesBackend.CODING) {
    return AssignmentTypes.CODING;
  }
  if (typeBackend == AssignmentTypesBackend.MULTIPLE_CHOICE) {
    return AssignmentTypes.MULTIPLE_CHOICE;
  }
  if (typeBackend == AssignmentTypesBackend.OPEN) {
    return AssignmentTypes.OPEN;
  }
}
