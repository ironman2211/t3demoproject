import React from "react";
import { Todo } from "~/types";

type TodoProps = {
  todo: Todo;
};
const TodoComp = ({ todo }: TodoProps) => {
  const { id, text, done } = todo;
  return <div>{text}</div>;
};

export default TodoComp;
