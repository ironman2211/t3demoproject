"use client";
import React from "react";
import Todo from "./Todo";
import { api } from "~/trpc/react";
const Todos = () => {
  const { data: todos, isLoading, isError } = api.todo.getAllTodos.useQuery();
  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error is getting data ...</>;
  return (
    <div className="flex flex-col items-center gap-5">
      <h1 className="text-3xl ">Todos</h1>
      {todos?.map((todo) => {
        return <Todo key={todo.id} todo={todo} />;
      })}
    </div>
  );
};

export default Todos;
