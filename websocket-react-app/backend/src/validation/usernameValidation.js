const {usernames} = require('../utils/sharedState');

function usernameConnectionIdMatch(queryParams){
    if (usernames.has(queryParams.username)) {
        const user = usernames.get(queryParams.username);
        if (user.connectionid !== queryParams.connectionid) {
          console.error('Connection ID mismatch for username:', queryParams.username);
          return false; 
        }
        return true; 
    } 
    return false;
}

module.exports = usernameConnectionIdMatch;