'use client';
import React, { type ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import LoadingScreen from '../components/common/LoadingScreen';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import store, { useSelector } from '../store';

const Loading = () => {
  const isRequestLoading = useSelector((state) => state.app.isLoading);

  return <>{isRequestLoading && <LoadingScreen />}</>;
};

interface Props {
  children: ReactNode;
}

const RootTemplate = ({ children }: Props) => {
  return (
    <ReduxProvider store={store}>
      <DndProvider backend={HTML5Backend}>
        <Loading />
        {children}
      </DndProvider>
    </ReduxProvider>
  );
};

export default RootTemplate;
