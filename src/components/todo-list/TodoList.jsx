import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Input, Button, Flex, useToast, Heading } from "@chakra-ui/react";
import useLocalStorage from "../../hooks/useLocalStorage/useLocalStorage";
import TodoItem from "../todo-item/ToDoItem";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const TodoList = () => {
  const { getUserData, setUserData } = useLocalStorage();
  const [todos, setTodos] = useState(getUserData("todos") || []);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const toast = useToast();

  useEffect(() => {
    setUserData(todos, "todos");
  }, [todos]);

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

  const toggleCompleted = useCallback(
    (id) => {
      const index = todos.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        const newTodos = [...todos];
        newTodos[index].completed = !newTodos[index].completed;
        setTodos(newTodos);
      }
    },
    [todos]
  );
  const editTodo = useCallback(
    (id, newTitle) => {
      const index = todos.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        const newTodo = { ...todos[index], title: newTitle };
        const newToDos = [
          ...todos.slice(0, index),
          newTodo,
          ...todos.slice(index + 1),
        ];
        setTodos(newToDos);
      }
    },
    [todos]
  );

  const deleteTodo = useCallback(
    (id) => {
      const newTodos = todos.filter((todo) => todo.id !== id);
      setTodos(newTodos);
    },
    [todos]
  );

  const allTodosCount = todos.length;
  const completedTodosCount = todos.filter((todo) => todo.completed).length;
  const uncompletedTodosCount = allTodosCount - completedTodosCount;

  const chartOptions = useMemo(() => {
    return {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  }, []);

  const chartData = useMemo(() => {
    return {
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
        },
      ],
    };
  }, [allTodosCount, completedTodosCount, uncompletedTodosCount]);

  return (
    <>
      <Heading my={"12px"}>To Do List</Heading>
      <Flex
        p={8}
        display={"flex"}
        gap={"16px"}
        flexWrap={"wrap"}
        justifyContent={"start"}
        w={"100%"}
      >
        <Box
          flex={1}
          display={"flex"}
          justifyContent={"center"}
          h={"fit-content"}
        >
          <Bar data={chartData} options={chartOptions} />
        </Box>
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
