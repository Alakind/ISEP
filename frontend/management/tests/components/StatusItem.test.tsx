import StatusItem from "../../src/components/StatusItem";
import {render} from "@testing-library/react";
import {InviteStatuses} from "../../src/utils/constants";

describe("StatusItem", () => {
  it("Should be able to show a status", () => {
    render(<StatusItem status={InviteStatuses.APP_REMINDED_ONCE}/>);

    const span = document.getElementsByTagName("span");
    expect(span[0]).toBeInTheDocument();
    expect(span[0]).toHaveClass("status-item");
    expect(span[0]).toHaveTextContent(InviteStatuses.APP_REMINDED_ONCE);
  })

  it("Should have a class named status-item--info", () => {
    render(<StatusItem status={InviteStatuses.APP_REMINDED_ONCE}/>);

    const span = document.getElementsByTagName("span");
    expect(span[0]).toHaveClass("status-item");
    expect(span[0]).toHaveClass("status-item--info");
  })

  it("Should have a class named status-item--error when Expired status", () => {
    render(<StatusItem status={InviteStatuses.EXPIRED}/>);

    const span = document.getElementsByTagName("span");
    expect(span[0]).toHaveClass("status-item");
    expect(span[0]).toHaveClass("status-item--error");
  })
})