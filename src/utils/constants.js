export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTE = import.meta.env.VITE_AUTH_ROUTE;

export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const GET_USER_INFO = `${AUTH_ROUTE}/user-info`;
