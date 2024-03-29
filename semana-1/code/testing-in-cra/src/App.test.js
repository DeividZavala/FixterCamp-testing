import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import renderer from "react-test-renderer";
import App from "./App";

describe("<App/>", () => {
  // fireEvent
  it("should add new items", () => {
    render(<App />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "nuevo item" },
    });
    fireEvent.click(screen.getByRole("button"));

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "nuevo item 2" },
    });
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getAllByRole("listitem").length).toBe(2);
  });
  it("should show error message if empty input", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Debes agregar texto")).toBeInTheDocument();
  });

  // userEvent
  it("should add new items", () => {
    render(<App />);
    userEvent.type(screen.getByRole("textbox"), "nuevo item con user event");
    userEvent.click(screen.getByRole("button"));
    expect(screen.getAllByRole("listitem").length).toBe(1);
  });
  it("should show error message if empty input", () => {
    render(<App />);
    userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Debes agregar texto")).toBeInTheDocument();
  });
});

describe("<App /> snapshot", () => {
  it("<App /> should match snapshot when data", () => {
    const data = ["test", "test 2"];
    const result = renderer.create(<App data={data} />).toJSON();
    expect(result).toMatchSnapshot();
  });
  it("<App /> should match snapshot if no data", () => {
    const result = renderer.create(<App />).toJSON();
    expect(result).toMatchSnapshot();
  });
});
