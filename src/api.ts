import axios from 'axios';
import { AppState } from "./state/appStateReducer";

export const save = async (payload: AppState) => {
    console.log(payload)
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_ENDPOINT}/save`, payload, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        throw new Error("Error while saving the state.");
    }
}

export const load = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_ENDPOINT}/load`, {
            headers: {
                Accept: "application/json",
            }
        });

        return response.data as AppState;
    } catch (error) {
        throw new Error("Error while loading the state.");
    }
}

export const deleteTaskFromList  = async (listId: string, taskId: string) => {
  try {
    const response = await axios.delete(`http://localhost:3000/list/${listId}/task/${taskId}`);
    console.log(response.data); // This will log the server response (e.g., a success message)
    return response.data;
  } catch (error) {
    console.error('Error while deleting the task:', error);
    throw error;
  }
}