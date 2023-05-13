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

const share = async () => {
  try {
    const token = generateToken();
    const shareUrl = `${window.location.origin}${window.location.pathname}?token=${encodeURIComponent(token)}`;
    await navigator.share({
      title: 'Custom Message Card',
      text: 'Check out this custom message card',
      url: shareUrl
    });
  } catch (err) {
    alert('Sharing is not supported on this device.');
  }
};

// add click event listener to share button
shareButton.addEventListener('click', () => {
  share();
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
