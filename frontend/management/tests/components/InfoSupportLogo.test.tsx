import {render} from "@testing-library/react";
import InfoSupportLogo from "../../src/components/InfoSupportLogo.tsx";

describe("InfoSupportLogo", () => {
  it("should be able to show a info support logo", () => {
    render(<InfoSupportLogo/>);

    const svg = document.getElementsByTagName("svg");
    expect(svg[0]).toBeInTheDocument();
    expect(svg[0]).toHaveClass("infoSupportLogo");
  })
})