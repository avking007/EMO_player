import { SET_ALERT, REMOVE_ALERT } from './types';
const initState = [];

export default function alert(state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT: 
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((al) => al.id !== payload);
    default:
      return state;
  }
}