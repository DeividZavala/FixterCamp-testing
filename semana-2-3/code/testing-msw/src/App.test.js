import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { server, rest } from "../jest/server";

test("<App/> renders and fetch todos", async () => {
  render(<App />);
  const items = await waitFor(() => screen.getAllByRole("listitem"));
  expect(items.length).toBe(1);
});

test("<App/> renders error", async () => {
  server.use(
    rest.get("http://localhost:4000/todos", (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ message: "http error" }));
    })
  );
  render(<App />);
  const error = await waitFor(() => screen.getByRole("heading"));
  expect(error).toBeInTheDocument();
  expect(error).toHaveTextContent("http error");
});
