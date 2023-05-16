// Generate a random token
const generateToken = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Shorten URL using base64 encoding
const shortenUrl = (url) => {
  const encodedUrl = btoa(url);
  return encodedUrl.substring(0, 8);
};

// Get DOM elements
const shareButton = document.getElementById('share-button');
const messageElement = document.getElementById('message');
const titleElement = document.getElementById('title');
const infoButton = document.getElementById('info-button');

// Add click event listener to share button
shareButton.addEventListener('click', () => {
  // Generate a new token
  const token = generateToken();

  // Create a share link with the message, title, and token in the query parameters
  const shareUrl = `${window.location.origin}${window.location.pathname}?message=${encodeURIComponent(messageElement.innerText)}&title=${encodeURIComponent(titleElement.innerText)}&token=${encodeURIComponent(token)}`;

  // Shorten the share URL
  const shortShareUrl = shortenUrl(shareUrl);

  // Show share dialog if supported, otherwise prompt the user to copy the link
  if (navigator.share) {
    navigator.share({
      title: 'Custom Message Card',
      text: 'Click 👉 ',
      url: shortShareUrl,
    });
  } else {
    prompt('Copy this URL and share it with others:', shortShareUrl);
  }
});

// Add click event listener to info button
infoButton.addEventListener('click', () => {
  alert('Introducing the latest tool by Shashi: the One-Time Message Sender. Iss tool ki madad se aap kisi ko message bhej sakte ho, jo sirf ek baar dikhayi dega, phir hamesha ke liye delete ho jaayega. Yeh tool sensitive information aur private conversations ke liye accha option hai.');
});

// Check if a message, title, and token are present in the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');
const title = urlParams.get('title');
const token = urlParams.get('token');

if (message && title && token) {
  // If a message, title, and token are present, show the message and title
  messageElement.innerText = message;
  titleElement.innerText = title;

  // Remove the token from the URL to prevent sharing the same message multiple times
  const urlWithoutToken = `${window.location.origin}${window.location.pathname}`;

  // Replace the URL in the browser's history without adding an entry
  window.history.replaceState({}, document.title, urlWithoutToken);
} else {
  // If no message, title, or token are present, show the default message and title
  messageElement.innerText = 'Enter your message here';
  titleElement.innerText = 'Enter Your Name';
}
