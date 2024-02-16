import React, { useEffect, useState } from "react";
import { Box, Input, Button, Flex, useToast, Heading } from "@chakra-ui/react";
import useLocalStorage from "../../hooks/useLocalStorage/useLocalStorage";
import TodoItem from "../todo-item/ToDoItem";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const { getUserData, setUserData } = useLocalStorage();

  useEffect(() => {
    const storedTodos = getUserData("todos");
    if (storedTodos) {
      setTodos(
        storedTodos.map((todo) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
        }))
      );
    }
  }, []);

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
    setUserData([...todos, newTodo], "todos");
    setNewTodoTitle("");
  };

  const toggleCompleted = (id) => {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      const newTodo = { ...todos[index], completed: !todos[index].completed };
      const newTodos = [
        ...todos.slice(0, index),
        newTodo,
        ...todos.slice(index + 1),
      ];
      setTodos(newTodos);
      setUserData(newTodos, "todos");
    }
  };

  const editTodo = (id, newTitle) => {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      const newTodo = { ...todos[index], title: newTitle };
      const newToDos = [
        ...todos.slice(0, index),
        newTodo,
        ...todos.slice(index + 1),
      ];
      setTodos(newToDos);
      setUserData(newToDos, "todos");
    }
  };

  const deleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    setUserData(newTodos, "todos");
  };

  const toast = useToast();

  const allTodosCount = todos.length;
  const completedTodosCount = todos.filter((todo) => todo.completed).length;
  const uncompletedTodosCount = allTodosCount - completedTodosCount;

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const chartData = {
    labels: ["All Todos", "Completed Todos", "Uncompleted Todos"],
    datasets: [
      {
        label: "Todos Count",
        data: [allTodosCount, completedTodosCount, uncompletedTodosCount],
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: [
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(255, 99, 132)",
        ],
      },
    ],
  };

  return (
    <>
      <Heading my={"12px"}>To Do List</Heading>
      <Flex
        p={8}
        display={"flex"}
        gap={"16px"}
        flexWrap={"wrap"}
        justifyContent={"start"}
      >
        <Box flex={1} display={"flex"} justifyContent={"center"} minW={"300px"} h={"fit-content"}>
          <Bar data={chartData} options={chartOptions} />
        </Box>
        <Box flex={2} minW={"300px"}>
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
          <Box paddingY={"12px"} maxH={"80vh"} overflowY={"auto"}>
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleCompleted={toggleCompleted}
                editTodo={editTodo}
                deleteTodo={deleteTodo}
              />
            ))}
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default TodoList;
