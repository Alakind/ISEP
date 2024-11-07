import { useEffect, useState } from "react";

import InterviewHeader from "../components/InterviewHeader";
import InterviewMain from "../components/InterviewMain";
import InterviewFooter from "../components/InterviewFooter";
import { AssignmentTypes } from "../utils/constants";
import "../styles/dark_mode.css";

function InterviewPageContainer() {
  const [interview, setInterview] = useState({ sections: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_APPLICANT_URL + "/section";

    // Fetch data from API
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setInterview({ sections: data });
        console.log(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  console.log(interview);

  //   const interview = {
  //     sections: [
  //       {
  //         assignments: [
  //           {
  //             id: "randomid12345678",
  //             type: AssignmentTypes.MULTIPLE_CHOICE,
  //             isSolved: false,
  //             text: ["What will I get if I will sum 2 and 2?"],
  //             options: ["42", "Isaac Newton", "Madagaskar"],
  //           },
  //           {
  //             id: "randomid4398630",
  //             type: AssignmentTypes.OPEN,
  //             isSolved: false,
  //             text: [
  //               "Write a 3000 words essay about Pepin the Short's conquests of the Rousillon.",
  //             ],
  //           },
  //         ],
  //       },
  //       {
  //         assignments: [
  //           {
  //             id: "randomid12345",
  //             type: AssignmentTypes.MULTIPLE_CHOICE,
  //             isSolved: false,
  //             text: ["What is the square root of -1?"],
  //             options: ["1", "0", "imagine it would have a number"],
  //           },
  //           {
  //             id: "randomid42069",
  //             type: AssignmentTypes.OPEN,
  //             isSolved: false,
  //             text: ["Proof the mathetical problem about P versus NP in 2 pages"],
  //           },
  //         ],
  //       },
  //     ],
  //   };

  return (
    <div className="page">
      <InterviewHeader interview={interview} />

      <InterviewMain interview={interview} isLoading={isLoading} />

      <InterviewFooter />
    </div>
  );
}

export default InterviewPageContainer;
