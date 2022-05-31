export const IN_PRODUCTION = true;

if (!IN_PRODUCTION) {
	document.body.setAttribute('data-in-development', 'true');
}

export const GOOGLE_SHEETS_API_KEY = (IN_PRODUCTION
	? "AIzaSyC5x4d6OaC62-PqkwtYWYTD5Geysx8iy5U" // Prod
	: (await import('./DEV_GOOGLE_SHEETS_API_KEY.js')).DEV_GOOGLE_SHEETS_API_KEY
);