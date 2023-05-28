const cardElement = document.getElementById('card');
const messageElement = document.getElementById('message');
const titleElement = document.getElementById('title');
const shareButton = document.getElementById('share-button');
const infoButton = document.getElementById('info-button');

// generate a random token and store it in local storage
const generateToken = () => {
  return Math.random().toString(36).substr(2, 9);
};

// add click event listener to share button
shareButton.addEventListener('click', async () => {
  // generate a new token and create a share link with the message, title, and token in the query parameters
  const token = generateToken();
  const shareUrl = `${window.location.origin}${window.location.pathname}?message=${encodeURIComponent(messageElement.innerText)}&title=${encodeURIComponent(titleElement.innerText)}&token=${encodeURIComponent(token)}`;

  // shorten the shareUrl using your custom API
  const apiEndpoint = 'https://bitelink.000webhostapp.com/api/shorten';
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer apibysk' // Replace with your fixed API key
    },
    body: JSON.stringify({
      longUrl: shareUrl
    })
  });
  const data = await response.json();
  
  // retrieve the short URL from the API response
  const shortUrl = data.shortUrl;

  // show share dialog if supported, otherwise prompt user to copy the link
  if (navigator.share) {
    navigator.share({
      title: 'Custom Message Card',
      text: 'Click 👉 ',
      url: shortUrl,
    });
  } else {
    prompt('Copy this URL and share it with others:', shortUrl);
  }
});

// Rest of the code...
