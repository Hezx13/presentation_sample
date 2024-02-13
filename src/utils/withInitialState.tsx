import React, { useState, useEffect } from "react";
import { AppState } from "../state/appStateReducer";
import { load } from "../api";
import CircularProgress from '@mui/material/CircularProgress';
import { eventEmitter } from "../state/EventEmitter";

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
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>();

    useEffect(() => {
      const fetchInitialState = async () => {
        setIsLoading(true);
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

      const handleLogin = () => {
        if (localStorage.getItem('token')) {
        fetchInitialState();
      } else {
        setIsLoading(false);
      }
      };
  
      eventEmitter.on('login', handleLogin);
      eventEmitter.on('savedMaterialsAdded', handleLogin);
  
      if (localStorage.getItem('token')) {
        fetchInitialState();
      } else {
        setIsLoading(false);
      }
  
      return () => {
        eventEmitter.off('login', handleLogin);
        eventEmitter.off('savedMaterialsAdded', handleLogin);

      };
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
