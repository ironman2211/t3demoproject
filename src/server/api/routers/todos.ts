import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { todoinput } from "~/types";

export const todoRouter = createTRPCRouter({
  getAllTodos: protectedProcedure.query(async ({ ctx }) => {
    const todos = await ctx.db.todo.findMany({
      where: {
        userId: ctx.session.user.id
      }
    })
    console.log(todos.map(({ id, text, done }) => ({ id, text, done })));
    return [
      {
        id: 2,
        text: "hello world",
        done: false,
      },
      {
        id: 1,
        text: "hello world 2022",
        done: false
      }
    ]
  }),
  createTodo: protectedProcedure
    .input(todoinput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          text: input,
          user: {
            connect: {
              id: ctx.session.user.id
            }
          }
        }
      })
    }),
  deleteTodo: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.delete({
        where: {
          id: input
        }
      })
    }),
  toggleTodo: protectedProcedure
    .input(z.object({
      id: z.string(),
      done: z.boolean(),
    }))
    .mutation(async ({ ctx, input: { id, done } }) => {
      return ctx.db.todo.update({
        where: {
          id
        }, data: {
          done
        }
      })
    }),
  updateTodo: protectedProcedure
    .input(z.object({
      id: z.string(),
      text: z.string(),
      done: z.boolean(),
    }))
    .mutation(({ ctx, input: { id, text, done } }) => {
      return ctx.db.todo.update({
        where: {
          id
        }, data: {
          text,
          done
        }
      })
    })
});
