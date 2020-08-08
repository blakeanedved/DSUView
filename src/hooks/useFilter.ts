import { useReducer } from 'react';

const useFilter = () => {
  return useReducer((_: RegExp, newFilter: string) => {
    let filterRegex = '[^\\s]*';

    for (const char of newFilter) {
      filterRegex += `[${char.toUpperCase()}${char.toLowerCase()}][^\\s]*`;
    }

    return new RegExp(filterRegex);
  }, new RegExp('[^\\s]*[33][^\\s]*'));
};

export default useFilter;
