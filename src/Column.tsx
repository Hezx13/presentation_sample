import { useRef, useState } from "react"
import { throttle } from "throttle-debounce-ts"
import { ColumnContainer, ColumnTitle } from "./styles"
import { useAppState } from "./state/AppStateContext"
import { Card } from "./Card"
import { AddNewItem } from "./AddNewItem"
import { useItemDrag } from "./utils/useItemDrag"
import { useDrop } from "react-dnd"
import { isHidden } from "./utils/isHidden"
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import {IconButton} from '@mui/material'
import {removeList} from './state/actions'

import {
  moveTask,
  moveList,
  addTask,
  setDraggedItem
} from "./state/actions"

type ColumnProps = {
  text: string
  id: string
  isPreview?: boolean
}

export const Column = ({ text, id, isPreview }: ColumnProps) => {
  const { draggedItem, getTasksByListId, dispatch } = useAppState()
  const tasks = getTasksByListId(id)
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
            onClick={()=>dispatch(removeList(id))}
            >
            <CloseIcon/>
          </IconButton>
          <IconButton
            disableRipple
           
            >
            <OpenInFullIcon/>
          </IconButton>
        </div>
      </ColumnTitle>
      {tasks.map((task) => (
        <Card
          id={task.id}
          columnId={id}
          text={task.text}
          key={task.id}
        />
      ))}
      <AddNewItem
        toggleButtonText="+ Add another card"
        onAdd={(text) => dispatch(addTask(text, id,'0AED',1))}
        dark
      />
    </ColumnContainer>
  )
}
