const { getLocalIPAddress } = require('./sharedFunctions');
// Το αρχείο αυτό περιέχει κοινές μεταβλητές που χρησιμοποιούνται σε όλο το backend.
const usernames = new Map();
const rooms = {};
const sharedState = {
    wss: null, // Initialize wss as null
};
const sharedIPAddress = getLocalIPAddress(); // Get the local IP address

module.exports = { usernames, rooms, sharedState, sharedIPAddress };