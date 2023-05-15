const cardElement = document.getElementById('card');
const messageElement = document.getElementById('message');
const titleElement = document.getElementById('title');
const shareButton = document.getElementById('share-button');
const infoButton = document.getElementById('info-button');

// generate a random key and store it in local storage
const generateKey = () => {
  return Math.random().toString(36).substr(2, 9);
};

// add click event listener to share button
shareButton.addEventListener('click', () => {
  // generate a new key and create a share link with the message, title, and key in the query parameters
  const key = generateKey();
  const shareUrl = `${window.location.origin}${window.location.pathname}?message=${encodeURIComponent(messageElement.innerText)}&title=${encodeURIComponent(titleElement.innerText)}&key=${encodeURIComponent(key)}`;

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

// check if a message, title, and key are present in the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');
const title = urlParams.get('title');
const key = urlParams.get('key');

if (message && title && key) {
  // if a message, title, and key are present, check if the key is valid and has not been used before
  const viewedKeys = JSON.parse(localStorage.getItem('viewedKeys')) || [];
  if (viewedKeys.includes(key)) {
    // if the key has already been viewed, show an error message
    messageElement.innerText = 'This message has already been viewed';
    titleElement.innerText = 'Invalid Key';
  } else {
    // if the key is valid and has not been used before, show the message and title and store the key in local storage
    messageElement.innerText = message;
    titleElement.innerText = title;
    viewedKeys.push(key);
    localStorage.setItem('viewedKeys', JSON.stringify(viewedKeys));
  }
} else {
  // if no message, title, or key are present, show the default message and title
  messageElement.innerText = 'Enter your message here';
  titleElement.innerText = 'Enter Your Name';
}
