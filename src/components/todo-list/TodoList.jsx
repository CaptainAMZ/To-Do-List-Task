import React, { useState } from "react";
import { Box, Input, Button, Flex, useToast } from "@chakra-ui/react";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const handleChange = (e) => {
    setNewTodoTitle(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodoTitle.trim() === "") {
      toast({
        title: "Error",
        description: "Todo title cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const newTodo = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTodoTitle,
      completed: false,
      createdAt: new Date(),
    };
    setTodos([...todos, newTodo]);
    setNewTodoTitle("");
  };

  const toggleCompleted = (id) => {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      const newTodo = { ...todos[index], completed: !todos[index].completed };
      setTodos([...todos.slice(0, index), newTodo, ...todos.slice(index + 1)]);
    }
  };

  const editTodo = (id, newTitle) => {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      const newTodo = { ...todos[index], title: newTitle };
      setTodos([...todos.slice(0, index), newTodo, ...todos.slice(index + 1)]);
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toast = useToast();

  return (
    <Flex w="100%" h="100%" p={8}>
      <Box flex={1}>
        <form style={{ display: "flex" }} onSubmit={handleSubmit}>
          <Input
            value={newTodoTitle}
            onChange={handleChange}
            placeholder="Enter a new todo"
            mr={4}
          />
          <Button type="submit" colorScheme="blue">
            Add
          </Button>
        </form>
        {/* {todos.map((todo) => (
         // Todo Component
        ))} */}
      </Box>
    </Flex>
  );
};

export default TodoList;
