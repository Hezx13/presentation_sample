import http from './api/http';
import hash from 'object-hash';
import Cookies from 'js-cookie';
import { AppState, List } from "./state/appStateReducer";

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
    try {
      const response = await http.post(`/save`, processedPayload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        
      });
  
      return response.data;
    } catch (error: any) {
      throw new Error(`Error while saving the state: ${error.message}`);
    }
  };
  

  export const load = async () => {
    try {
        const dep = Cookies.get('selectedDepartment');
        console.log(dep)
        const response = await http.get(`/load`, {
            params: {
                department: dep
            },
            headers: {
                Accept: "application/json",
            }
        });
        return response.data; 
    } catch (error) {
        console.error("Error while loading the state:", error);
        throw new Error("Error while loading the state.");
    }
};

export const getProjectsList = async () => {
  const res = await http.get(`/projectsList`);
  return res.data;
}

export const archiveList = async (listId: string) => {
    http.post('/archive', {listId})
        .then((response) => console.log(response.data))
        .catch((error) => console.error(error))
}

export const deleteAll = async (toDelete: string) => {
  try {
    const res = await http.delete(`/deleteAll?toDelete=${toDelete}`)
    return res.status;
  } catch (err) {
    throw new Error("Error while deleting collection");
  }
}

export const downloadExcel = () => {
    http({
        method: 'GET',
        url: `/download`,
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
    const dep: string = localStorage.getItem('selectedDepartment') as string
    formData.append('department', dep); // Append department name to formData

    try {
        const res = await http.post(`/upload`, formData, {
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
        const res = await http.post(`/upload/${listId}`, formData, {
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

export const generateReport = async(period, payment) => {
  const department = localStorage.getItem('selectedDepartment');
  const payload = {...period, payment, department}
  const res = await http.post(`/generate_report`, payload, {
});
return res.status;
}

export const loadReports = async() => {
  try {
    const response = await http.get(`/reports`, {
        params:{
          department: localStorage.getItem('selectedDepartment')
        },
        headers: {
            Accept: "application/json",
        }
    });
    return response.data.reports;
} catch (error) {
    throw new Error("Error while loading the reports.");
}
}

export const addDebit = async(period, debit, payment) => {
  const department = localStorage.getItem('selectedDepartment');
  let dataToProcess = {periodStart: period, valueToInsert: debit, pay: payment, department: department};

  const res = await http.post(`/add_debit`, dataToProcess, {
  });
  return res.status;
};

export const removeDebit = async(period, debit, payment) => {
  const department = localStorage.getItem('selectedDepartment');
  let dataToProcess = {periodStart: period, valueToRemove: debit, pay: payment, department: department};

  const res = await http.post(`/remove_debit`, dataToProcess, {
  });
  return res.status;
};

export const downloadReport = async (period, payment) => {
  try {
    const department = localStorage.getItem('selectedDepartment');
    const response = await http({
      method: 'GET',
      url: `/download_report`,
      params: { periodStart: period, pay: payment, department: department }, // Adding period as a query parameter
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Report${period} ${department} ${payment}.xlsx`);
    document.body.appendChild(link);
    link.click();
    
    return response.status; // Return the status if successful
  } catch (error) {
    console.error("Error downloading the report:", error);
    return new Error(); //
  }
};
