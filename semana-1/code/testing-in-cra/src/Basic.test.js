import React from "react";
import Basic from "./Basic";
import { render, screen } from "@testing-library/react";

describe("Basic", () => {
  it("should render", () => {
    render(<Basic title="Lista" data={["test 1", "test 2"]} />);
    const header = screen.getByRole("heading", { name: "Lista" });
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBe(2);
    expect(header).toBeInTheDocument();
  });
});
