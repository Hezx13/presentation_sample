import { Action } from "./actions"
import { nanoid } from "nanoid"
import { DragItem } from "../DragItem"
import { findItemIndexById, moveItem, removeItemAtIndex } from "../utils/arrayUtils"

export type Task = {
  id: string
  text: string
  price: string
  quantity: number
  
}

export type List = {
  id: string
  text: string
  tasks: Task[]
}

export type AppState = {
  draggedItem: DragItem | null
  lists: List[]
}

export const appStateReducer = (
  draft: AppState,
  action: Action
): AppState | void => {
  switch (action.type) {
    case "SET_DRAGGED_ITEM": {
      draft.draggedItem = action.payload
      break
    }
    case "ADD_LIST": {
      draft.lists.push({
        id: nanoid(),
        text: action.payload,
        tasks: []
      })
      break
    }
    case "ADD_TASK": {
      const { text, listId, price, quantity } = action.payload
      const targetListIndex = findItemIndexById(draft.lists, listId)
      console.log(targetListIndex)
      draft.lists[targetListIndex].tasks.push({
        id: nanoid(),
        text,
        price,
        quantity,
      })
      break
    }
      case "REMOVE_LIST": {
        const { listId } = action.payload
        draft.lists = draft.lists.filter(list => list.id !== listId);
        break;
      }
      case "EDIT_TASK":{
        const { taskId, listId, text } = action.payload; // get the task id, list id and new text from the payload
        const targetListIndex = findItemIndexById(draft.lists, listId); // find the list where the task is

        const targetTaskIndex = findItemIndexById(draft.lists[targetListIndex].tasks, taskId); // within that list, find the task

        draft.lists[targetListIndex].tasks[targetTaskIndex].text = text; // change the text of the task to the new text
        break;
      }
      case "REMOVE_TASK": {
        const { listId, taskId } = action.payload;
          const targetListIndex = findItemIndexById(draft.lists, listId);
        
          draft.lists[targetListIndex].tasks = draft.lists[targetListIndex].tasks.filter(task => task.id !== taskId);
          break;
        
      } 
      case "MOVE_LIST": {
      const { draggedId, hoverId } = action.payload
      const dragIndex = findItemIndexById(draft.lists, draggedId)
      const hoverIndex = findItemIndexById(draft.lists, hoverId)
      draft.lists = moveItem(draft.lists, dragIndex, hoverIndex)
      break
    }
    case "MOVE_TASK": {
      const {
        draggedItemId,
        hoveredItemId,
        sourceColumnId,
        targetColumnId
      } = action.payload

      const sourceListIndex = findItemIndexById(
        draft.lists,
        sourceColumnId
      )
      const targetListIndex = findItemIndexById(
        draft.lists,
        targetColumnId
      )

      const dragIndex = findItemIndexById(
        draft.lists[sourceListIndex].tasks,
        draggedItemId
      )

      const hoverIndex = hoveredItemId
        ? findItemIndexById(
            draft.lists[targetListIndex].tasks,
            hoveredItemId
          )
        : 0
      const item = draft.lists[sourceListIndex].tasks[dragIndex]

      // Remove the task from the source list
      draft.lists[sourceListIndex].tasks.splice(dragIndex, 1)

      // Add the task to the target list
      draft.lists[targetListIndex].tasks.splice(hoverIndex, 0, item)
      break
    }
    default: {
      break
    }
  }
}
