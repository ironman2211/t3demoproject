"use client";
import React from "react";
import { Todo } from "~/types";
import { api } from "~/trpc/react";
import { toast } from "react-hot-toast";

type TodoProps = {
  todo: Todo;
};
const TodoComp = ({ todo }: TodoProps) => {
  const { id, text, done } = todo;
  const trpc = api.useContext();
  const { mutate: doneMutate } = api.todo.toggleTodo.useMutation({
    onMutate: async ({ id, done }) => {

        await trpc.todo.getAllTodos.cancel()

        // Snapshot the previous value
        const previousTodos = trpc.todo.getAllTodos.getData()

        // Optimistically update to the new value
        trpc.todo.getAllTodos.setData(undefined, (prev) => {
            if (!prev) return previousTodos
            return prev.map(t => {
                if (t.id === id) {
                    return ({
                        ...t,
                        done
                    })
                }
                return t
            })
        })

        // Return a context object with the snapshotted value
        return { previousTodos }
    },
    onError: (err, done, context) => {
        toast.error(`An error occured when marking todo as ${done ? "done" : "undone"}`)
        if (!context) return
        trpc.todo.getAllTodos.setData(undefined, () => context.previousTodos)
    },
    onSettled: async () => {
      await trpc.todo.getAllTodos.invalidate();
    },
  });
  const { mutate: delteMutation } = api.todo.deleteTodo.useMutation({
    onSettled: async () => {
      await trpc.todo.getAllTodos.invalidate();
    },
  });

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <input
          className="focus:ring-3 h-4 w-4 cursor-pointer rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
          type="checkbox"
          name="done"
          id={id}
          checked={done}
          onChange={(e) => {
            doneMutate({ id, done: e.target.checked });
          }}
        />
        <label
          htmlFor={id}
          className={`cursor-pointer ${done ? "line-through" : ""}`}
        >
          {text}
        </label>
      </div>
      <button
        className="w-full rounded-lg bg-blue-700 px-2 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => {
          delteMutation(id);
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default TodoComp;
