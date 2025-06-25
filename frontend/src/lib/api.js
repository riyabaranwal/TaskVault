import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const API_ENDPOINTS = {
  GET_TASKS: `${API_BASE_URL}/tasks`,
  CREATE_TASK: `${API_BASE_URL}/tasks`,
  UPDATE_TASK: (taskId) => `${API_BASE_URL}/tasks/${taskId}`,
  DELETE_TASK: (taskId) => `${API_BASE_URL}/tasks/${taskId}`,
};

export const getTasks = async () => {
  const res = await axios.get(API_ENDPOINTS.GET_TASKS);
  try {
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const createTask = async (taskData) => {
  try {
    const res = await axios.post(API_ENDPOINTS.CREATE_TASK, taskData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const res = await axios.put(API_ENDPOINTS.UPDATE_TASK(taskId), taskData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteTask = async (taskId) => {
  try {
    const res = await axios.delete(API_ENDPOINTS.DELETE_TASK(taskId));
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error) => {
  console.log(error);
  if (error.response) {
    throw error.response.data.message || "Internal Server Error";
  }
  throw error.message || "Internal Server Error";
};
