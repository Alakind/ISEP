import {ChangeEvent, useEffect, useRef, useState} from "react";
import {AssignmentOpenInterface} from "../utils/types";
import {sendSimpleSolution} from "../utils/apiFunctions";

function AssignmentOpen({assignment, setAssignmentAnswer}: Readonly<Props>) {
  const [value, setValue] = useState("");
  const valueRef = useRef(value);
  const [updateIntervalId, setUpdateIntervalId] = useState<NodeJS.Timeout>();

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    setValue(assignment.answer.answer);
  }, []);

  const handleOnFocus = () => {
    const intervalId = setInterval(async () => {
      await handleSendSolution(valueRef.current);
    }, 5000);

    setUpdateIntervalId(intervalId);
  };

  const handleBlur = async () => {
    clearInterval(updateIntervalId);
    setUpdateIntervalId(undefined);

    await handleSendSolution(value);
  };

  const handleTextChange = async (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
  };

  const handleSendSolution = async (newValue: string) => {
    setAssignmentAnswer({answer: newValue});
    await sendSimpleSolution(assignment, newValue);
  };

  return (
    <textarea
      className="assignment__textarea"
      placeholder="Type here ..."
      name={assignment.id}
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
        handleTextChange(event)
      }
      value={value}
      onFocus={handleOnFocus}
      onBlur={handleBlur}
    />
  );
}

interface Props {
  assignment: AssignmentOpenInterface;
  setAssignmentAnswer: (arg: object) => void;
}

export default AssignmentOpen;
