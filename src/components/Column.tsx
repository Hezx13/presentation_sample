import { useRef, useState } from "react"
import { throttle } from "throttle-debounce-ts"
import { ColumnContainer, ColumnTitle } from "../styles"
import { useAppState } from "../state/AppStateContext"
import { Card } from "./Card"
import { AddNewItem } from "./AddNewItem"
import { useItemDrag } from "../utils/useItemDrag"
import { useDrop } from "react-dnd"
import { isHidden } from "../utils/isHidden"
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import {IconButton} from '@mui/material'
import {moveToArchive, removeList, moveFromArchive} from '../state/actions'
import { useNavigate } from 'react-router-dom';


import {
  moveTask,
  moveList,
  addTask,
  setDraggedItem
} from "../state/actions"

type ColumnProps = {
  text: string
  id: string
  isArchive?: boolean
  isPreview?: boolean
}

export const Column = ({ text, id, isArchive, isPreview }: ColumnProps) => {
  const navigate = useNavigate();
  const { draggedItem, getTasksByListId, getTasksByArchiveId, dispatch } = useAppState()
  const tasks = isArchive ? getTasksByArchiveId(id) : getTasksByListId(id)
  const ref = useRef<HTMLDivElement>(null)
  const [, drop] = useDrop({
    accept: ["COLUMN", "CARD"],
    hover: throttle(200, () => {
      if (!draggedItem) {
        return
      }
      if (draggedItem.type === "COLUMN") {
        if (draggedItem.id === id) {
          return
        }

        dispatch(moveList(draggedItem.id, id))
      } else {
        if (draggedItem.columnId === id) {
          return
        }
        if (tasks.length) {
          return
        }

        dispatch(
          moveTask(draggedItem.id, null, draggedItem.columnId, id)
        )
        dispatch(setDraggedItem({ ...draggedItem, columnId: id }))
      }
    })
  })

  const { drag } = useItemDrag({ type: "COLUMN", id, text })

  drag(drop(ref))

  const handleExpandToTable = (id) =>{
    navigate('/table', { state: { myData: id } });
  }

  const getCurrentDateAndTime = () =>{
    const today = new Date();
    const now = new Date();

    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ':' + now.getSeconds().toString().padStart(2, '0');
    const date = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
  return date + " " + time;
  }

  const getNextWeek = () => {
    const today = new Date();
    const weekFromNow = new Date(today);
    weekFromNow.setDate(today.getDate() + 7);
    return weekFromNow.toString()
  }

  return (
    <ColumnContainer
      isPreview={isPreview}
      ref={ref}
      isHidden={isHidden(isPreview, draggedItem, "COLUMN", id)}
    >
      <ColumnTitle>
        <div>
          {text}
        </div>
        <div>
          <IconButton
            disableRipple
            onClick={()=> {
              isArchive ?
                  dispatch(removeList(id))
                  :
                  dispatch(moveToArchive(id))
            }}
            >
            <CloseIcon/>
          </IconButton>
          <IconButton
            disableRipple
            onClick={()=>{handleExpandToTable(id)}}
            >
            <OpenInFullIcon/>
          </IconButton>
        </div>
      </ColumnTitle>
      {tasks.map((task) => (
          task.status !== 'Done' &&
        <Card
          id={task.id}
          columnId={id}
          price={task.price}
          quantity={task.quantity}
          status={task.status}
          unit={task.unit}
          text={task.text}
          key={task.id}
        />
      ))}
      <AddNewItem
        toggleButtonText="+ Add another material"
        onAdd={
        (text,article, price, quantity, unit, comment, deliveryDate, orderedBy) => {
          dispatch(moveFromArchive(id))
          dispatch(addTask(text, id,article || '', price + ' AED', quantity || 0, getCurrentDateAndTime(), unit || 'pcs', comment || "", deliveryDate || getNextWeek(), orderedBy || 'Anonymus', "Pending", ""))
        }
      }
        dark
      />
    </ColumnContainer>
  )
}
