import React from 'react'
import "./index.css"
import ReactDOM from "react-dom";
import App from "./App"
import { DndProvider } from "react-dnd"
import { HTML5Backend as Backend } from "react-dnd-html5-backend"
import { AppStateProvider } from "./state/AppStateContext"

ReactDOM.render(
  <DndProvider backend={Backend}>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </DndProvider>,
  document.getElementById("root")
)

