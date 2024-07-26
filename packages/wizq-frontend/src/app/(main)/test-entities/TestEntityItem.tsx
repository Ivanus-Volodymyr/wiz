import React from 'react';
import { useSelector } from 'react-redux';

import { TestEntity } from '../../../types';
import { RootState } from '../../../store';

interface Props {
  id: TestEntity['id'];
}

const TestEntityItem = ({ id }: Props) => {
  const testEntity = useSelector((state: RootState) => state.testEntities.data[id]);

  return (
    <tr>
      <td>{testEntity.name}</td>
      <td>{testEntity.email}</td>
      <td>{testEntity.phone}</td>
    </tr>
  );
};

export default TestEntityItem;
