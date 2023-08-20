import { useRef, useState } from "react"
import { CardContainer, DeleteTaskButton, EditTaskButton } from "./styles"
import { useItemDrag } from "./utils/useItemDrag"
import { useDrop } from "react-dnd"
import { useAppState } from "./state/AppStateContext"
import { isHidden } from "./utils/isHidden"
import { moveTask, setDraggedItem, removeTask, editTask } from "./state/actions"
import { throttle } from "throttle-debounce-ts"
type CardProps = {
  text: string
  id: string
  columnId: string
  isPreview?: boolean
}

export const Card = ({
  text,
  id,
  columnId,
  isPreview
}: CardProps) => {
  const { draggedItem, dispatch } = useAppState()
  const ref = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false);
  const { drag } = useItemDrag({
    type: "CARD",
    id,
    text,
    columnId
  })

  const [, drop] = useDrop(
    () => ({
      accept: "CARD",
      hover: throttle(200, () => {
        if (!draggedItem) {
          return
        }
        if (draggedItem.type !== "CARD") {
          return
        }
        if (draggedItem.id === id) {
          return
        }

        dispatch(
          moveTask(draggedItem.id, id, draggedItem.columnId, columnId)
        )
        dispatch(setDraggedItem({ ...draggedItem, columnId }))
      })
    }),
    [draggedItem]
  )

  drag(drop(ref))

  return (
    <CardContainer
      isHidden={isHidden(isPreview, draggedItem, "CARD", id)}
      isPreview={isPreview}
      ref={ref}
    >
      <div>
        {text}
        
      </div>
      <div
        style={{display: 'flex', gap: 1}}>
        <DeleteTaskButton
          onClick={() => dispatch(removeTask(columnId,id ))}
        >
          delete
        </DeleteTaskButton>
        <EditTaskButton
          onClick={() => setIsEditing(!isEditing)}
          >
          {isEditing ? 'save' : 'edit'}
        </EditTaskButton>
      </div>
    </CardContainer>
  )
}
