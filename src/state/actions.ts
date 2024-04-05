export type Action =
  | {
      type: "ADD_LIST"
      payload: {
        text: string,
        department: string
      }
    }
  | {
      type: "REMOVE_LIST",
      payload: {
        listId: string
      }
    }
  |{
    type: "MOVE_TO_ARCHIVE",
    payload: {
      listId: string
    }
    }
| {
  type: "MOVE_FROM_ARCHIVE",
      payload: {
  listId: string
  }
  }
| {
  type: "ADD_SAVED_TASK_TO_PROJECT",
  payload: {
    projectId: string
    materialId: string
  }
  }
  | {
      type: "ADD_TASK"
      payload: {
        text: string;
        listId: string;
        article: string;
        price: string;
        quantity: number;
        date: Date;
        unit: string;
        comment: string;
        deliveryDate: Date;
        orderedBy: string;
        status: string;
        payment: string;
      }
    }


    | {
      type: "EDIT_TASK"
      payload: {
        id: string,
        listId: string,
        text: string,
        article: string,
        price: string,
        quantity: number,
        date: Date,
        unit: string,
        comment: string,
        deliveryDate: Date,
        orderedBy: string,
        status: string,
        payment: string,
      }
    }
  
  | {
      type: "REMOVE_TASK"
      payload: { listId: string; taskId: string;}
    }

export const addTask = (
    text: string,
    listId: string,
    article: string,
    price: string,
    quantity: number,
    date: Date,
    unit: string,
    comment: string,
    deliveryDate: Date,
    orderedBy: string,
    status: string,
    payment: string
): Action => ({
  type: "ADD_TASK",
  payload: {
    text,
    listId,
    price,
    article,
    quantity,
    date,
    unit,
    comment,
    deliveryDate,
    orderedBy,
    status,
    payment
  }
});

export const editTask = (
    id: string,
    listId: string,
    text: string,
    article: string,
    price: string,
    quantity: number,
    date: Date,
    unit: string,
    comment: string,
    deliveryDate: Date,
    orderedBy: string,
    status: string,
    payment: string,
) :Action => ({
  type: "EDIT_TASK",
  payload: {
    id,
    listId,
    text,
    article,
    price,
    quantity,
    date,
    unit,
    comment,
    deliveryDate,
    orderedBy,
    status,
    payment,
  },
});


export const addList = (text: string, department: string): Action => ({
  type: "ADD_LIST",
  payload: {
    text,
    department
  }
})

export const removeList = (listId: string): Action => ({
  type: "REMOVE_LIST",
  payload: {
    listId
  }
})

export const moveToArchive = (listId: string) : Action => ({
  type: "MOVE_TO_ARCHIVE",
  payload: {listId},
});

export const moveFromArchive = (listId: string) : Action => ({
  type: "MOVE_FROM_ARCHIVE",
  payload: {listId},
});

export const removeTask = (listId: string, taskId: string): Action => ({
  type: "REMOVE_TASK",
  payload:{
  listId,
  taskId
  }
})
