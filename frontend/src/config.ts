import Constants from 'expo-constants';

const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost ? debuggerHost.split(':')[0] : '127.0.0.1';

// Set this to true to use the new AWS Serverless backend
const USE_SERVERLESS = false; 

export const API_CONFIG = {
  baseUrl: `http://${localhost}:3000/api`,
  serverless: {
    topics: "PASTE_TOPICS_URL_HERE",
    aiContent: "PASTE_AI_CONTENT_URL_HERE",
    generateAudio: "PASTE_GENERATE_AUDIO_URL_HERE",
    transcribe: "PASTE_TRANSCRIBE_URL_HERE",
  }
};

export const getApiUrl = (feature?: keyof typeof API_CONFIG.serverless) => {
  if (USE_SERVERLESS && feature && API_CONFIG.serverless[feature] !== "PASTE_URL_HERE") {
    return API_CONFIG.serverless[feature];
  }
  return API_CONFIG.baseUrl;
};
