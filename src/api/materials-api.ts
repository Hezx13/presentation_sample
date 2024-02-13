import http from "./http";

export const getSavedMaterials = async () => {
    try {
      const response = await http.get('/materials');
      return response.data;
    } catch (error: any) {
      console.error('Error while fetching materials data:', error.response || error);
      throw new Error("Error while fetching materials data.");
    }
  };

export const saveMaterial = async (material: string[], list: string) => {
    try {
      const response = await http.post('/materials/saveMaterial', {
        materialId: material, listId: list
      });
      return response.status;
    } catch (error: any) {
      console.error('Error while saving material:', error.response || error);
      throw new Error("Error while saving material.");
    }
  };

export const removeMaterial = async (material) => {
    try {
      const response = await http.delete(`/materials/removeMaterial?idToRemove=${material}`);
      return response.status;
    } catch (error: any) {
      console.error('Error while deleting material:', error.response || error);
      throw new Error("Error while deleting material.");
    }
  };

export const getMaterialCount = async () =>{
  try {
    const response = await http.get(`/materials/savedMaterialCount`);
    return response.data;
  } catch (error: any) {
    console.error('Error while fetching materials count:', error.response || error);
    throw new Error("Error while fetching materials count.");
  }
} 

export const addToProject = async (material, list) => {
    try {
      const response = await http.put(`/materials/addToProject`, {
        projectId: list,
        materialId: material 
      });
      return response.status;
    } catch (error: any) {
      console.error('Error while deleting material:', error.response || error);
      throw new Error("Error while deleting material.");
    }
  };