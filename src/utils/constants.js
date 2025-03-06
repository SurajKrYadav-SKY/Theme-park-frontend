export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTE = import.meta.env.VITE_AUTH_ROUTE;

export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const GET_USER_INFO = `${AUTH_ROUTE}/user-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTE}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/remove-profile-image`;
export const OPEN_AI_GENERATE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/open-ai-gen-pic`;
export const HUGGING_FACE_GENERATE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/hugging-face-gen-pic`;
