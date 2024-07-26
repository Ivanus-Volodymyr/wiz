'use client';
import React from 'react';
import TestEntityItem from './TestEntityItem';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useGetTestEntitiesQuery } from '../../../store/testEntities';

const TestEntitiesPage = () => {
  const ids = useSelector((state: RootState) => state.testEntities.ids);

  const { isLoading } = useGetTestEntitiesQuery(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        {ids.map((id) => (
          <TestEntityItem key={id} id={id} />
        ))}
      </tbody>
    </table>
  );
};

export default TestEntitiesPage;
