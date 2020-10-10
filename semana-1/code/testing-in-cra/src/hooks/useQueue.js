import { useState } from "react";

const useQueue = () => {
  const [state, set] = useState([]);

  return {
    add: (value) => {
      set((queue) => [...queue, value]);
    },
    remove: () => {
      let result;
      set(([first, ...rest]) => {
        result = first;
        return rest;
      });
      return result;
    },
    first: () => {
      return state[0];
    },
    last: () => {
      return state[state.length - 1];
    },
    size: () => {
      return state.length;
    },
  };
};

export default useQueue;
