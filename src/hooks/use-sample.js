import { useMemo, useState } from 'react';
import { range, sampleSize } from 'lodash';

// a version of sampleSize that uses the same indices as long as the input array's length is stable
const useSample = (items, size) => {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const refreshSample = () => setRefreshCounter((oldVal) => oldVal + 1);
  const indices = useMemo(() => sampleSize(range(items.length), size), [items.length, size, refreshCounter]);
  return [indices.map((idx) => items[idx]), refreshSample];
};

export default useSample;
