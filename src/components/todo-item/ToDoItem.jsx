import React, { memo, useState } from "react";
import {
  Box,
  Input,
  Button,
  Checkbox,
  Text,
  Flex,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

const TodoItem = ({ todo, toggleCompleted, editTodo, deleteTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  console.log("To Do Item");

  const handleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editedTitle.trim() === "") {
      toast({
        title: "Error",
        description: "Todo title cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    editTodo(todo.id, editedTitle);
    setIsEditing(false);
  };

  const toast = useToast();

  return (
    <Box
      p={4}
      mb={4}
      borderWidth={1}
      borderRadius={8}
      boxShadow="lg"
      bg="white"
    >
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <Input value={editedTitle} onChange={handleChange} autoFocus mr={4} />
          <Button marginY={"8px"} type="submit" colorScheme="blue">
            Save
          </Button>
        </form>
      ) : (
        <Flex align="center">
          <Checkbox
            isChecked={todo.completed}
            onChange={() => toggleCompleted(todo.id)}
            mr={4}
          />
          <Text
            as="span"
            flex={1}
            textDecoration={todo.completed ? "line-through" : "none"}
          >
            {todo.title}
          </Text>
          <IconButton
            icon={<EditIcon />}
            aria-label="Edit"
            colorScheme="yellow"
            onClick={() => setIsEditing(true)}
            mr={2}
          />
          <IconButton
            icon={<DeleteIcon />}
            aria-label="Delete"
            colorScheme="red"
            onClick={() => deleteTodo(todo.id)}
          />
        </Flex>
      )}
      <Text fontSize="sm" color="gray.500" mt={2}>
        Created at: {new Date(todo.createdAt).toLocaleString()}
      </Text>
    </Box>
  );
};

export default memo(TodoItem);
