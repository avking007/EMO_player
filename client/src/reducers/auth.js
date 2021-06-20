import { LOGIN_FAIL, LOGIN_SUCCESS, SIGNUP_FAIL, SIGNUP_SUCCESS } from "./types";

const initState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
}

export default function authorize(state = initState, dispatch) {
    const { action, payload } = dispatch;
    switch (action) {
        case SIGNUP_SUCCESS:
        case LOGIN_SUCCESS: 
            localStorage.setItem('token', payload.token);
            return {...state, ...payload, loading: false,isAuthenticated: true};
        
        case SIGNUP_FAIL:
        case LOGIN_FAIL:
            localStorage.removeItem('token');
            return {...state, loading: true, isAuthenticated:false, token: null}
        
        default: return state
    }

}