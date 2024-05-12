import { Action } from "./actions"
import { nanoid } from "nanoid"
import { DragItem } from "../components/DragItem"
import {findItemIndexById, findTaskIndex, moveItem, removeItemAtIndex} from "../utils/arrayUtils"
import { getCurrentDateAndTime } from "../utils/timeUtils"
import { BreakfastDiningOutlined } from "@mui/icons-material"


export const appStateReducer = (
  draft: AppState,
  action: Action
): AppState | void => {
  switch (action.type) {
    case "ADD_LIST": {
      const {text, department, processSave} = action.payload;
      draft.processSave = processSave;
      const newList = {
        id: nanoid(),
        department: department,
        text: text,
        tasks: []
      }
      draft.lists.push(newList)
      draft.listsToAdd[newList.id] = newList
      break
    }
    case "ADD_TASK": {
      const { text, listId, article, price, quantity, date, unit, comment, deliveryDate, orderedBy, status, payment, processSave} = action.payload;
      draft.processSave = processSave;
      let targetListIndex: number = findItemIndexById(draft.lists, listId);
      const newTask: Task =  {
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
      }

      if (targetListIndex !== -1) {
        draft.lists[targetListIndex].tasks.push(newTask);
        draft.listsToUpdate[draft.lists[targetListIndex]._id!] = draft.lists[targetListIndex].tasks
      }
      else {
        targetListIndex = findItemIndexById(draft.archive, listId);
        if (targetListIndex === -1)
          return ;
        draft.archive[targetListIndex].tasks.push(newTask);
        draft.archiveToUpdate[draft.archive[targetListIndex]._id!] = draft.archive[targetListIndex].tasks
      }
      break;
    }
    case "EDIT_TASK": {
      const { id, listId, text,article, price, quantity, date, unit, comment, deliveryDate, orderedBy, status, payment, processSave } = action.payload;
      const { location, listIndex, taskIndex }= findTaskIndex(id, draft)
      draft.processSave = processSave;
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

        if (isTextChanged || isArticleChanged) {
          const currentDate = getCurrentDateAndTime();
          task.date = currentDate;
        }
        
        location === 'lists' 
        ? draft.listsToUpdate[draft.lists[listIndex]._id!] = draft.lists[listIndex].tasks
        : draft.archiveToUpdate[draft.lists[listIndex]._id!] = draft.archive[listIndex].tasks
      }
      break;
    }


    case "REMOVE_LIST": {
        const { listId, processSave } = action.payload
        draft.processSave = processSave;
        const targetListIndex = findItemIndexById(draft.lists, listId);

        if (targetListIndex !== -1){
          draft.listsToRemove[draft.lists[targetListIndex]._id!] = 1
          draft.lists = draft.lists.filter(list => list.id !== listId);
        } else {
          const targetListIndex = findItemIndexById(draft.archive, listId);
          draft.archiveToRemove[draft.archive[targetListIndex]._id!] = 1;
          draft.archive = draft.archive.filter(list => list.id !== listId);
        }
        break;
      }
    case "MOVE_TO_ARCHIVE":{
      const {listId, processSave} = action.payload
      draft.processSave = processSave
      const listIndex  = findItemIndexById(draft.lists, listId);
      if (listIndex < 0) return; // If list not found, exit the case

      const listToArchive = draft.lists[listIndex];

      draft.archiveToAdd[draft.lists[listIndex]._id!] = draft.lists[listIndex];
      draft.listsToRemove[draft.lists[listIndex]._id!] = 1;

      draft.archive.push(listToArchive); // Add the list to archive
      draft.lists.splice(listIndex, 1); // Remove the list from lists
      
      break;

    }
    case "MOVE_FROM_ARCHIVE":{
      const {listId, processSave} = action.payload
      draft.processSave = processSave;
      const listIndex  = findItemIndexById(draft.archive, listId);
      if (listIndex < 0) return; // If list not found, exit the case
      const listFromArchive = draft.archive[listIndex];

      draft.archiveToRemove[draft.archive[listIndex]._id!] = 1;
      draft.listsToAdd[draft.archive[listIndex]._id!] = draft.archive[listIndex];

      draft.lists.push(listFromArchive); // Add the list to archive
      draft.archive.splice(listIndex, 1); // Remove the list from lists


      break;

    }
      case "REMOVE_TASK": {
        const { listId, taskId, processSave } = action.payload;
        draft.processSave = processSave;
          let targetListIndex = findItemIndexById(draft.lists, listId);
          if (targetListIndex > -1) {
            draft.lists[targetListIndex].tasks = draft.lists[targetListIndex].tasks.filter(task => task.id !== taskId);
            draft.listsToUpdate[draft.lists[targetListIndex]._id!] = draft.lists[targetListIndex].tasks
          }
          else {
            targetListIndex = findItemIndexById(draft.archive, listId);
            if (targetListIndex === -1) return;
            draft.archive[targetListIndex].tasks = draft.archive[targetListIndex].tasks.filter(task => task.id !== taskId);
            draft.archiveToUpdate[draft.archive[targetListIndex]._id!] = draft.archiveToAdd[targetListIndex].tasks
          }
          break;
        
      }
      case "ADD_SAVED_TASK_TO_PROJECT": {
        const {projectId, materialId} = action.payload
        let targetListIndex = findItemIndexById(draft.lists, projectId);
        break;
      }
      case "RESET_REQUESTS": {
        draft.listsToAdd = {}
        draft.listsToRemove = {}
        draft.listsToUpdate = {}
        draft.archiveToAdd = {}
        draft.archiveToRemove = {}
        draft.archiveToUpdate = {}
        break;
      }
    default: {
      break
    }
  }
}
