import { useState } from "react"
import { useFocus } from "../utils/useFocus"
import {
  NewItemFormContainer,
  NewItemButton,
  NewItemInput
} from "../styles/styles"
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, {Dayjs} from "dayjs";
type NewItemFormProps = {
    onAdd(text: string,article?:string, price?: string, quantity?: number, unit?: string, comment?: string, deliveryDate?: string, orderedBy?: string): void
}

export const NewItemForm = ({ onAdd }: NewItemFormProps) => {
  const [text, setText] = useState("")
  const [article, setArticle] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState<string>("")
    const [unit, setUnit] = useState("")
    const [comment, setComment] = useState("")
    const [deliveryDate, setDeliveryDate] = useState<Dayjs | null>(dayjs());
    const [orderedBy, setOrderedBy] = useState("")


  const inputRef = useFocus()

  const resetValues = () =>{
    setText("")
    setArticle("")
    setPrice("")
    setQuantity("")
      setUnit("")
      setComment("")
      setDeliveryDate(dayjs())
      setOrderedBy("")
  }

  const handleAddText = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      onAdd(text,article, price, parseInt(quantity), unit, comment, deliveryDate?.format('DD-MM-YYYY').toString(), orderedBy)
    }
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2); // Adding 1 because months are 0-indexed
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  }

  return (
    <NewItemFormContainer>
      <NewItemInput
        ref={inputRef}
        value={text}
        placeholder="Material"
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleAddText}
      />
      <NewItemInput
        ref={inputRef}
        value={article}
        placeholder="Article number"
        onChange={(e) => setArticle(e.target.value)}
        onKeyPress={handleAddText}
      />
      <NewItemInput
        value={quantity}
        placeholder="Quantity"
        onChange={(e) => setQuantity(e.target.value)}
        onKeyPress={handleAddText}
      />
        <NewItemInput
            value={unit}
            placeholder="pcs, kilograms, bottles, etc."
            onChange={(e) => setUnit(e.target.value)}
            onKeyPress={handleAddText}
        />
        <NewItemInput
            value={price}
            placeholder="Price"
            onChange={(e) => setPrice(e.target.value)}
            onKeyPress={handleAddText}
        />
        <NewItemInput
            value={comment}
            placeholder="Comment"
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={handleAddText}
        />

      <DatePicker
          label="Delivery Date"
          value={deliveryDate}
          onChange={(newValue) => setDeliveryDate(newValue)}
      />

      <NewItemInput
            value={orderedBy}
            placeholder="Ordered by"
            onChange={(e) => setOrderedBy(e.target.value)}
            onKeyPress={handleAddText}
        />
      <NewItemButton onClick={() => {onAdd(text,article, price, parseInt(quantity), unit, comment, deliveryDate?.format('DD-MM-YYYY').toString(), orderedBy); resetValues(); }}>
        Create
      </NewItemButton>
    </NewItemFormContainer>
  )
}
