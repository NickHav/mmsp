const { getLocalIPAddress } = require('./sharedFunctions');

const usernames = new Map();
const rooms = {};
const sharedState = {
    wss: null, 
};
const sharedIPAddress = getLocalIPAddress(); 

module.exports = { usernames, rooms, sharedState, sharedIPAddress };