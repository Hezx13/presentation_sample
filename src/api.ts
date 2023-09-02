import axios from 'axios';
import { AppState } from "./state/appStateReducer";
import {response} from "express";

export const save = async (payload: AppState) => {
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
    console.log("success");
    return response.data;
  } catch (error) {
    console.error('Error while deleting the task:', error);
    throw error;
  }
}

export const archiveList = async (listId: string) => {
    axios.post('/archive', {listId})
        .then((response) => console.log(response.data))
        .catch((error) => console.error(error))
}

export const downloadExcel = () => {
    axios({
        method: 'GET',
        url: `${process.env.REACT_APP_BACKEND_ENDPOINT}/download`,
        responseType: 'blob',
    })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'MyWorkbook.xlsx');
            document.body.appendChild(link);
            link.click();
        });
};

export const onUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_ENDPOINT}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Data imported successfully');
    } catch (error) {
        console.error('Failed to upload file');
    }
};