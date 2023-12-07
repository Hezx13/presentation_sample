import { createContext, useContext, useEffect, useCallback, useRef } from "react"
import { useImmerReducer } from "use-immer"
import {
  appStateReducer,
  AppState,
  List,
  Task
} from "./appStateReducer"
import { Action } from "./actions"
import { withInitialState } from "../utils/withInitialState"
import { debounce } from "throttle-debounce-ts"
import { save } from "../api"
import { DragItem } from "../components/DragItem"

type AppStateContextProps = {
  draggedItem: DragItem | null
  lists: List[]
    archive: List[]
  getTasksByListId(id: string): Task[]
    getTasksByArchiveId(id: string) : Task[]
  dispatch: React.Dispatch<Action>
}

const AppStateContext = createContext<AppStateContextProps>(
  {} as AppStateContextProps
)

type AppStateProviderProps = {
  children: React.ReactNode
  initialState: AppState
}

export const AppStateProvider = withInitialState<AppStateProviderProps>(
  ({ children, initialState }) => {
    const [state, dispatch] = useImmerReducer(appStateReducer, initialState);

    // useRef to keep track of the previous state
    const prevStateRef = useRef(initialState);

    const debouncedSave = useCallback(debounce(500, (currentState, prevState) => {
      save(currentState, prevState);
      prevStateRef.current = currentState;
    }), []);
    
    useEffect(() => {
      debouncedSave(state, prevStateRef.current);
    }, [state, debouncedSave]);
    

    const { draggedItem, lists, archive } = state;
    const getTasksByListId = (id: string) => {
      return lists.find((list) => list.id === id)?.tasks || [];
    };
    const getTasksByArchiveId = (id: string) => {
      return archive.find((list) => list.id === id)?.tasks || [];
    };

    return (
      <AppStateContext.Provider
        value={{ draggedItem, lists, archive, getTasksByListId, getTasksByArchiveId, dispatch }}
      >
        {children}
      </AppStateContext.Provider>
    );
  }
);


export const useAppState = () => {
  return useContext(AppStateContext)
}
