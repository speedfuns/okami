import bingo from '../js/bingo.js'
import {
  GOOGLE_SHEETS_API_KEY,
} from '../authentication.js'

const API_KEY = GOOGLE_SHEETS_API_KEY;

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

/**
 * Callback after api.js is loaded.
 */
window.onGoogleSheetsAPILoaded(() => {
  gapi.load('client', parseObjectives);
});

async function parseObjectives() {
  try {
    await gapi.client.init({
      'apiKey':  API_KEY,
      'discoveryDocs': [ DISCOVERY_DOC ],
    });
  } catch (err) {
    console.error('Failed to initialize Google API clinet: ', err);
    return;
  }
  let response;
  try {
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '1eTmfECVVlp1nswOpbsviUjMK-cUwHziLK5nLn4rbuH4',
      range: 'Objectives!A2:A',
    });
  } catch (err) {
    throw err;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    throw err("Didn't get any data :(");
  }
  const challengePool = range.values.map(row => row[0]);
  $(function() {
    bingo(challengePool);
    document.body.setAttribute('data-loading', 'false');
  });
}