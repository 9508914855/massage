
const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type');
const token = urlParams.get('token');

if (type === 'link' && token) {
  // hide the message element if the type is link
  messageElement.style.display = 'none';
} else if (message && token) {
  // show the message on the card if the type is not link and a message and token are present
  messageElement.innerText = message;
  localStorage.setItem(token, true);
} else {
  // show the default message if no message or token are present
  messageElement.innerText = 'Enter your message here';
}

// get elements
const cardElement = document.getElementById('card');
const messageElement = document.getElementById('message');
const shakeButton = document.getElementById('shake-button');
const shareButton = document.getElementById('share-button');

// add click event listener to shake button
shakeButton.addEventListener('click', () => {
    cardElement.classList.add('shake');
    setTimeout(() => {
        cardElement.classList.remove('shake');
    }, 1000);
});

// generate a random token and store it in local storage
const generateToken = () => {
  return Math.random().toString(36).substr(2, 9);
};

// add click event listener to share button
shareButton.addEventListener('click', () => {
  // generate a new token and create a share link with the message and token in the query parameters
  const token = generateToken();
  const shareUrl = `${window.location.origin}${window.location.pathname}?token=${encodeURIComponent(token)}&type=link`;


  // show share dialog if supported, otherwise prompt user to copy the link
  if (navigator.share) {
    navigator.share({
      title: 'Custom Message Card',
      text: messageElement.innerText,
      url: shareUrl,
    });
  } else {
    prompt('Copy this URL and share it with others:', shareUrl);
  }
});

// check if a message and token are present in the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');
const token = urlParams.get('token');

if (message && token) {
  // if a message and token are present, check if the token is valid
  const viewedToken = localStorage.getItem(token);

  if (viewedToken === null) {
    // if the token is valid, show the message and store the token in local storage
    messageElement.innerText = message;
    localStorage.setItem(token, true);
  } else {
    // if the token has already been viewed, show the default message
    messageElement.innerText = 'Enter your message here';
  }
} else {
  // if no message or token are present, show the default message
  messageElement.innerText = 'Enter your message here';
}