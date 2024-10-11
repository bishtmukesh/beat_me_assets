export const SERVER_BASE_URL = "https://ec2-13-232-88-163.ap-south-1.compute.amazonaws.com";
export const TEST_API_BASE_URL = "/test";
export const API_BASE_URL = "/beatMe";

export const HOME_PAGE_URL = '/';

// login / register
export const LOGIN_PAGE_URL = '/login';
export const REGISTER_PAGE_URL = '/register';
export const ACCOUNT_PAGE_URL = '/account';

export const SERVER_LOGIN_ENDPOINT = `${API_BASE_URL}/login`;
export const SERVER_REGISTER_ENDPOINT = `${API_BASE_URL}/register`;
export const FETCH_AUTHENTICATION_STATUS_ENDPOINT = `${API_BASE_URL}/fetch_authentication_status`;

// Socket endpoints
export const STOMP_ENDPONT = "/room";
export const ROOM_SUBSCRIPTION_PREFIX = "/room";
export const PRIVATE_ENDPOINT_SUBSCRIPTION_PREFIX = "/user";
export const SERVER_CHAT_ENDPOINT = "/message/chat";
export const SERVER_SUB_CONFIRMATION_ENDPOINT = "/message/confirmation";

export const ROOM_UPDATE_MESSAGE_ENDPOINT = "/message/room_update";

// Pictionary endpoints
export const  PICTIONARY_UPDATE_MESSAGE_ENDPOINT = "/message/pictionary_update";

/***************************************************************************************/

// APIs
export const API1 = `${TEST_API_BASE_URL}/api1`;
export const API2 = `${TEST_API_BASE_URL}/api2`;
export const GENERATE_ROOM_CODE_URL = `${API_BASE_URL}/generate_room_code`;

export const GAME_ROOM_URL = "/room";