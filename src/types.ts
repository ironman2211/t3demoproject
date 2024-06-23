import { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import type { AppRouter } from "./server/api/root";


type RouterOutputs = inferRouterOutputs<AppRouter>;
type getAllTodosOutput = RouterOutputs["todo"]["getAllTodos"];

export type Todo = getAllTodosOutput[number];

export const todoinput = z.string({
    required_error: "This field is required",
    message: "This field is required",
}).min(1).max(100);