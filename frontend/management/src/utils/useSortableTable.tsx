import { useState } from "react";
import {ApplicantInterface, UserInterface} from "./types.tsx";
export const useSortableTable = (data) : [UserInterface[] | ApplicantInterface[], (sortField: string, sortOrder: string) => void] => {
  const [tableData, setTableData] = useState<UserInterface[]|ApplicantInterface[]>(data);

  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
      const sorted = [...tableData].sort((a, b) => {
        if (a[sortField] === null) return 1;
        if (b[sortField] === null) return -1;
        if (a[sortField] === null && b[sortField] === null) return 0;
        return (
          a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
            numeric: true,
          }) * (sortOrder === "asc" ? 1 : -1)
        );
      });
      setTableData(sorted);
    }
  };

  return [tableData, handleSorting];
};