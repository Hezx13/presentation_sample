import {useEffect, useRef, useState} from "react"
import { CardContainer, DeleteTaskButton, EditTaskButton } from "../styles"
import {CardMainText, CardPriceText, CardQuantityText} from "../textStyles";
import { useItemDrag } from "../utils/useItemDrag"
import { useDrop } from "react-dnd"
import { useAppState } from "../state/AppStateContext"
import { isHidden } from "../utils/isHidden"
import { moveTask, setDraggedItem, removeTask, editTask } from "../state/actions"
import { throttle } from "throttle-debounce-ts"
type CardProps = {
  text: string
  id: string
  price: string
  quantity: number
  status: string
  unit: string
  columnId: string
  isPreview?: boolean
}

export const Card = ({
  text,
  id,
  price,
  quantity,
  status,
  unit,
  columnId,
  isPreview
}: CardProps) => {
  const { draggedItem, dispatch } = useAppState()
  const ref = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false);
  const [isPriceSet, setIsPriceSet] = useState(false)
  const { drag } = useItemDrag({
    type: "CARD",
    id,
    text,
    columnId,
    quantity,
    status,
    price,
    unit
  })

  useEffect(() => {
    let pr = parseFloat(price.split(' ')[0])
    setIsPriceSet(!Number.isNaN(pr) || (status === "In process" || status === "Done"))
  }, [price]);

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
      isPriceSet={isPriceSet}
    >
      <div>
        <CardMainText>
          {text}
        </CardMainText>
        <span>
          <CardPriceText>
          {parseFloat(price) * quantity} AED
        </CardPriceText>
        <CardQuantityText>
          {quantity && quantity.toString()} {unit}
        </CardQuantityText>
        </span>

      </div>
      <div
        style={{display: 'flex', gap: 1}}>
        <DeleteTaskButton
          onClick={() => dispatch(removeTask(columnId,id ))}
        >
          delete
        </DeleteTaskButton>
      </div>
    </CardContainer>
  )
}
