import { useState } from 'react';

let counter = 0;

const useUniqueId = () => {
  const [uniqueId] = useState(() => {
    counter += 1;
    return counter;
  });
  return `unique-${uniqueId}`;
};

export const resetUniqueId = () => {
  counter = 0;
};

export default useUniqueId;
