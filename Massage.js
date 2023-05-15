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
shareButton.addEventListener('click', () => {
  // generate a new token and create a share link with the message, title, and token in the query parameters
  const token = generateToken();
  const shareUrl = `${window.location.origin}${window.location.pathname}?message=${encodeURIComponent(messageElement.innerText)}&title=${encodeURIComponent(titleElement.innerText)}&token=${encodeURIComponent(token)}&key=${encodeURIComponent(generateToken())}`;

  // show share dialog if supported, otherwise prompt user to copy the link
  if (navigator.share) {
    navigator.share({
      title: 'Custom Message Card',
      text: 'Click 👉 ',
      url: shareUrl,
    });
  } else {
    prompt('Copy this URL and share it with others:', shareUrl);
  }
});


// add click event listener to info button
infoButton.addEventListener('click', () => {
  alert('Introducing the latest tool by Shashi: the One-Time Message Sender. Iss tool ki madad se aap kisi ko message bhej sakte ho, jo sirf ek baar dikhayi dega, phir hamesha ke liye delete ho jaayega. Yeh tool sensitive information aur private conversations ke liye accha option hai.');
});


// check if a message, title, token, and key are present in the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');
const title = urlParams.get('title');
const token = urlParams.get('token');
const key = urlParams.get('key');

if (message && title && token && key) {
  // if a message, title, token, and key are present, check if the key is valid
  const validKey = localStorage.getItem(token);

  if (validKey === null && key === token) {
    // if the key is valid, show the message and title and store the token in local storage
    messageElement.innerText = message;
    titleElement.innerText = title;
    localStorage.setItem(token, true);
  } else {
    // if the key is not valid, show an error message
    messageElement.innerText = 'Invalid URL or link has expired';
    titleElement.innerText = 'Error';
  }
} else {
  // if no message, title, token, or key are present, show the default message and title
  messageElement.innerText = 'Enter your message here';
  titleElement.innerText = 'Enter Your Name';
}
