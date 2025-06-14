async function checkUsernameAvailability(username) {
    try {
      const response = await fetch('/api/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error checking username availability');
      }
  
      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  }

  module.exports = { checkUsernameAvailability };