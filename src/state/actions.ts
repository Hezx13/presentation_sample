import { DragItem } from "../DragItem"

export type Action =
  | {
      type: "SET_DRAGGED_ITEM"
      payload: DragItem | null
    }
  | {
      type: "ADD_LIST"
      payload: string
    }
  | {
      type: "REMOVE_LIST",
      payload: {
        listId: string
      }
    }
  | {
      type: "ADD_TASK"
      payload: { text: string, listId: string, price: string, quantity: number }
    }
  
  | {
      type: "EDIT_TASK"
      payload: {
        listId: string,
        taskId: string,
        text: string,
      }
    }
  
  | {
      type: "REMOVE_TASK"
      payload: { listId: string; taskId: string;}
    }
  | {
      type: "MOVE_LIST"
      payload: {
        draggedId: string
        hoverId: string
      }
    }
  | {
      type: "MOVE_TASK"
      payload: {
        draggedItemId: string
        hoveredItemId: string | null
        sourceColumnId: string
        targetColumnId: string
      }
    }

export const moveTask = (
  draggedItemId: string,
  hoveredItemId: string | null,
  sourceColumnId: string,
  targetColumnId: string
): Action => ({
  type: "MOVE_TASK",
  payload: {
    draggedItemId,
    hoveredItemId,
    sourceColumnId,
    targetColumnId
  }
})

export const moveList = (
  draggedId: string,
  hoverId: string
): Action => ({
  type: "MOVE_LIST",
  payload: {
    draggedId,
    hoverId
  }
})

export const addTask = (text: string, listId: string, price: string, quantity: number): Action => ({
  type: "ADD_TASK",
  payload: {
    text,
    listId,
    price,
    quantity
  }
})

export const addList = (text: string): Action => ({
  type: "ADD_LIST",
  payload: text
})

export const removeList = (listId: string): Action => ({
  type: "REMOVE_LIST",
  payload: {
    listId
  }
})

export const removeTask = (listId: string, taskId: string): Action => ({
  type: "REMOVE_TASK",
  payload:{
  listId,
  taskId
  }
})

export const editTask = (listId: string, taskId: string, text: string): Action => ({
  type: "EDIT_TASK",
  payload:{
    listId,
    taskId,
    text
  }
})


export const setDraggedItem = (
  draggedItem: DragItem | null
): Action => ({
  type: "SET_DRAGGED_ITEM",
  payload: draggedItem
})
