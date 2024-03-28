import { Action } from "./actions"
import { nanoid } from "nanoid"
import { DragItem } from "../components/DragItem"
import {findItemIndexById, findTaskIndex, moveItem, removeItemAtIndex} from "../utils/arrayUtils"
import { getCurrentDateAndTime } from "../utils/timeUtils"

export type Task = {
  id: string;
  text: string;
  article: string;
  price: string;
  quantity: number;
  date: string;
  unit: string;
  comment: string;
  deliveryDate: string;
  orderedBy: string;
  status: string;
  payment: string;
}


export type List = {
  id: string
  text: string
  tasks: Task[]
}

export type AppState = {
  lists: List[]
  archive: List[]
  role: string
}

export const appStateReducer = (
  draft: AppState,
  action: Action
): AppState | void => {
  switch (action.type) {
    case "ADD_LIST": {
      draft.lists.push({
        id: nanoid(),
        text: action.payload,
        tasks: []
      })
      break
    }
    case "ADD_TASK": {
      const { text, listId, article, price, quantity, date, unit, comment, deliveryDate, orderedBy, status, payment } = action.payload;
      let targetListIndex = findItemIndexById(draft.lists, listId);
      if (targetListIndex !== -1) {
        draft.lists[targetListIndex].tasks.push({
          id: nanoid(),
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
        });
      }
      else {
        targetListIndex = findItemIndexById(draft.archive, listId);
        if (targetListIndex === -1)
          return ;
        draft.archive[targetListIndex].tasks.push({
          id: nanoid(),
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
        });
      }
      break;
    }
    case "EDIT_TASK": {
      const { id, listId, text,article, price, quantity, date, unit, comment, deliveryDate, orderedBy, status, payment } = action.payload;
      const targetListIndex = findItemIndexById(draft.lists, listId);
      const { location, listIndex, taskIndex }= findTaskIndex(id, draft)

      if (taskIndex !== -1 && listIndex !== -1) {
        const task = location === 'lists' ? draft.lists[listIndex].tasks[taskIndex] : draft.archive[listIndex].tasks[taskIndex];
        
        const isTextChanged = text !== undefined && text !== task.text;
        const isArticleChanged = article !== undefined && article !== task.article;
        
        task.text = text ?? task.text;
        task.article = article ?? task.article;
        task.price = price ?? task.price;
        task.quantity = quantity ?? task.quantity;
        task.date = date ?? task.date;
        task.unit = unit ?? task.unit;
        task.comment = comment ?? task.comment;
        task.deliveryDate = deliveryDate ?? task.deliveryDate;
        task.orderedBy = orderedBy ?? task.orderedBy;
        task.status = status ?? task.status;
        task.payment = payment ?? task.payment;

        
        
        console.log(isTextChanged, isArticleChanged)

        if (isTextChanged || isArticleChanged) {
          const currentDate = getCurrentDateAndTime();
          task.date = currentDate;
      } 
      }
      break;
    }


    case "REMOVE_LIST": {
        const { listId } = action.payload
        draft.lists = draft.lists.filter(list => list.id !== listId);
        draft.archive = draft.archive.filter(list => list.id !== listId);
        break;
      }
    case "MOVE_TO_ARCHIVE":{
      const {listId} = action.payload

      const listIndex  = findItemIndexById(draft.lists, listId);
      if (listIndex < 0) return; // If list not found, exit the case

      const listToArchive = draft.lists[listIndex];
      draft.archive.push(listToArchive); // Add the list to archive
      draft.lists.splice(listIndex, 1); // Remove the list from lists
      break;

    }
    case "MOVE_FROM_ARCHIVE":{
      const {listId} = action.payload

      const listIndex  = findItemIndexById(draft.archive, listId);
      if (listIndex < 0) return; // If list not found, exit the case
      const listFromArchive = draft.archive[listIndex];
      draft.lists.push(listFromArchive); // Add the list to archive
      draft.archive.splice(listIndex, 1); // Remove the list from lists
      break;

    }
      case "REMOVE_TASK": {
        const { listId, taskId } = action.payload;
          let targetListIndex = findItemIndexById(draft.lists, listId);
          if (targetListIndex > -1) {
            draft.lists[targetListIndex].tasks = draft.lists[targetListIndex].tasks.filter(task => task.id !== taskId);
          }
          else {
            targetListIndex = findItemIndexById(draft.archive, listId);
            if (targetListIndex === -1) return;
            draft.archive[targetListIndex].tasks = draft.archive[targetListIndex].tasks.filter(task => task.id !== taskId);
          }
          break;
        
      }
      case "ADD_SAVED_TASK_TO_PROJECT": {
        const {projectId, materialId} = action.payload
        let targetListIndex = findItemIndexById(draft.lists, projectId);
      }
    default: {
      break
    }
  }
}
