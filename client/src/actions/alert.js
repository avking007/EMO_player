import { SET_ALERT, REMOVE_ALERT } from '../reducers/types';
import { v4 } from 'uuid';

export const set_alert = (msg, alertType) => (dispatch) => {
  const id = v4();
  dispatch({ type: SET_ALERT, payload: { msg, alertType, id } });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), 3000);
};