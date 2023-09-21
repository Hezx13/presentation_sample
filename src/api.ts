import axios from 'axios';
import hash from 'object-hash';
import { AppState, List } from "./state/appStateReducer";
import {response} from "express";

export const save = async (payload: AppState, old: AppState) => {
    const oldListIds = new Set(old.lists.map(list => list.id));
    const oldArchiveIds = new Set(old.archive.map(archive => archive.id));
    const oldListTasksHash = new Map(old.lists.map(list => [list.id, hash(list.tasks)]));
    const oldArchiveTasksHash = new Map(old.archive.map(list => [list.id, hash(list.tasks)]));
    
    const listsToAdd: List[] = [];
    const archiveToAdd: List[] = [];
    const listsToRemove: string[] = [];
    const archiveToRemove: string[] = [];
    const listsToUpdate: List[] = [];
    const archiveToUpdate: List[] = [];
  
    for (const newList of payload.lists) {
      if (!oldListIds.has(newList.id)) {
        listsToAdd.push(newList);
      } else if (oldListTasksHash.get(newList.id) !== hash(newList.tasks)) {
        listsToUpdate.push(newList);
      }
    }
  
    for (const newArchive of payload.archive) {
      if (!oldArchiveIds.has(newArchive.id)) {
        archiveToAdd.push(newArchive);
      } else if (oldArchiveTasksHash.get(newArchive.id) !== hash(newArchive.tasks)) {
        archiveToUpdate.push(newArchive);
      }
    }
  
    listsToRemove.push(...Array.from(oldListIds).filter(id => !payload.lists.some(list => list.id === id)));
    archiveToRemove.push(...Array.from(oldArchiveIds).filter(id => !payload.archive.some(archive => archive.id === id)));
  
    const processedPayload = {
      listsToAdd,
      archiveToAdd,
      listsToRemove,
      archiveToRemove,
      listsToUpdate,
      archiveToUpdate
    };
    console.log(processedPayload);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_ENDPOINT}/save`, processedPayload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
  
      return response.data;
    } catch (error: any) { // Explicitly type error as 'any' to access 'message'
      throw new Error(`Error while saving the state: ${error.message}`);
    }
  };
  

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
        window.alert('Data imported successfully');
        window.location.reload();
    } catch (error) {
        console.error('Failed to upload file');
    }
};

export const onUploadSingle = async (file, listId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_ENDPOINT}/upload/${listId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        window.alert('Data imported successfully');
        window.location.reload();
    } catch (error) {
        console.error('Failed to upload file');
    }
}