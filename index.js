const core = require('@actions/core');
const axios = require('axios');
const https = require('https');

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

async function getAuthToken(serverUrl, appKey, appSecret) {
  core.info(`Attempting to get auth token from ${serverUrl}/api/v1/login`);
  const response = await axiosInstance.post(`${serverUrl}/api/v1/login`, {
    appKey: appKey,
    appSecret: appSecret
  });
  core.info('Successfully obtained auth token');
  return response.data.tokenId;
}

async function makeRequest(description, requestFn) {
  try {
    core.info(`Starting request: ${description}`);
    const result = await requestFn();
    core.info(`Successfully completed request: ${description}`);
    return result;
  } catch (error) {
    core.error('=== Error Details ===');
    core.error(`Error Message: ${error.message}`);
    core.error(`Status: ${error.response?.status}`);
    core.error(`Status Text: ${error.response?.statusText}`);
    
    if (error.response?.data) {
      core.error('Response Data:');
      core.error(JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.config) {
      core.error('Request Details:');
      core.error(`URL: ${error.config.url}`);
      core.error(`Method: ${error.config.method}`);
      core.error('Request Data:');
      core.error(JSON.stringify(error.config.data, null, 2));
    }
    
    core.error('=== End Error Details ===');

    const apiMessage = error.response?.data?.message;
    throw new Error(`${description} failed: ${apiMessage || error.message} (Status: ${error.response?.status})`);
  }
}

async function run() {
  try {
    core.info('Starting Devolutions Server Login action');
    
    const serverUrl = core.getInput('server_url');
    const appKey = core.getInput('app_key');
    const appSecret = core.getInput('app_secret');
    const outputVariable = core.getInput('output_variable');

    core.info(`Server URL: ${serverUrl}`);
    core.info('Attempting authentication...');
    
    const token = await makeRequest('Authentication', () => 
      getAuthToken(serverUrl, appKey, appSecret)
    );

    core.setSecret(token);
    core.exportVariable(outputVariable, token);
    core.setOutput('token', token);
    core.info('Action completed successfully');
  } catch (error) {
    core.error(`Action failed: ${error.message}`);
    core.setFailed(error.message);
  }
}

run();