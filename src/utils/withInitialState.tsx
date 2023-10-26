import React, { useState, useEffect } from "react";
import { AppState } from "../state/appStateReducer";
import { load } from "../api";
import CircularProgress from '@mui/material/CircularProgress';

type InjectedProps = {
  initialState: AppState;
};

type PropsWithoutInjected<TBaseProps> = Omit<
  TBaseProps,
  keyof InjectedProps
>;

type WithInjectedProps<TProps> = TProps & InjectedProps;


export const LoadingSpinner = () => {
  return (
    <div style={{ 
      display: 'flex',
       flexDirection: 'column',
        justifyContent: 'center',
         alignItems: 'center',
          height: '100vh',
          color: 'white'
          }}>
      <CircularProgress sx={{color: 'orange'}}/>
      <div>Development sample</div>
      <div>Loading may take a while...</div>
    </div>
  );
};


export function withInitialState<TProps>(
  WrappedComponent
) {
  return (props: PropsWithoutInjected<TProps>) => {
    const [initialState, setInitialState] = useState<AppState>({
      lists: [],
      archive: [],
      draggedItem: null
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>();

    useEffect(() => {
      const fetchInitialState = async () => {
        try {
          const data = await load();
          setInitialState(data);
        } catch (e) {
          if (e instanceof Error) {
            setError(e);
          }
        }
        setIsLoading(false);
      };
      fetchInitialState();
    }, []);

    if (isLoading) {
      return <LoadingSpinner></LoadingSpinner>;
    }

    if (error) {
      return <div>{error.message}</div>;
    }

    // Pass props and initialState to WrappedComponent
    return <WrappedComponent {...props} initialState={initialState} />;
  };
}
