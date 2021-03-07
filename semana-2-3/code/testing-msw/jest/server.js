import { rest } from "msw";
import { setupServer } from "msw/node";

const handlers = [
  rest.get("http://localhost:4000/todos", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([{ id: 1, body: "first todo" }]));
  }),
];

const server = setupServer(...handlers);

export { server, rest };
