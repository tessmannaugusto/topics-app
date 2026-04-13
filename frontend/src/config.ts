import Constants from 'expo-constants';

// For development, we use the local IP of the machine running the backend
// In a real device, localhost won't work, so we use the debugger host or a hardcoded IP
const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

export const API_URL = `http://${localhost}:3000/api`;
