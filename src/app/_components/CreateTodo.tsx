"use client";
import React, { useState } from "react";
import { todoinput } from "~/types";
import { toast } from "react-hot-toast";
import { api } from "~/trpc/react";
const CreateTodo = () => {
  const [newTodo, setnewTodo] = useState("");
  const { mutate } = api.todo.createTodo.useMutation({
    onMutate: async (newTodo) => {
      // cancel any outgoing requests
      await trpc.todo.getAllTodos.cancel();

      // snapshot the previous data

      const previousData = await trpc.todo.getAllTodos.getData();

      // Optimistically update the data

      trpc.todo.getAllTodos.setData(undefined, (prev) => {
        const optimisticTodo = {
          id: "optimistic-id",
          text: "newTodo",
          done: false,
        };
        if (!prev) return [optimisticTodo];
        return [...prev, optimisticTodo];
      });
      setnewTodo("");
      return { previousData };
    },
    onError: (error, newTodo, context) => {
      toast.error("an error accured in ceating a todo");
      setnewTodo(newTodo);
      trpc.todo.getAllTodos.setData(undefined, () => context?.previousData);
    },
    onSettled: async () => {
      await trpc.todo.getAllTodos.invalidate();
    },
  });
  const trpc = api.useContext();
  return (
    <div className="flex gap-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const result = todoinput.safeParse(newTodo);
          if (!result.success) {
            toast.error(result.error.format()._errors.join(", "));
            return;
          } else {
            mutate(newTodo);
          }
        }}
      >
        <input
          type="text"
          className="p-2 outline-none"
          value={newTodo}
          onChange={(e) => setnewTodo(e.target.value)}
        />
        <button>Add </button>
      </form>
    </div>
  );
};

export default CreateTodo;
