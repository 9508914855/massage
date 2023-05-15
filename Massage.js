const cardElement = document.getElementById('card');
const messageElement = document.getElementById('message');
const titleElement = document.getElementById('title');
const shareButton = document.getElementById('share-button');
const infoButton = document.getElementById('info-button');

// initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyARmfvuovDozZbATHUeLKJusAQIlX9quZg",
  authDomain: "otm-token.firebaseapp.com",
  projectId: "otm-token",
});

// generate a random token and store it in Firestore
const generateToken = async () => {
  const token = Math.random().toString(36).substr(2, 9);
  await firebase.firestore().collection('tokens').doc(token).set({
    viewed: false
  });
  return token;
};

// add click event listener to share button
shareButton.addEventListener('click', async () => {
  // generate a new token and create a share link with the message, title, and token in the query parameters
  const token = await generateToken();
  const shareUrl = `${window.location.origin}${window.location.pathname}?message=${encodeURIComponent(messageElement.innerText)}&title=${encodeURIComponent(titleElement.innerText)}&token=${encodeURIComponent(token)}`;

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

// check if a message, title, and token are present in the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');
const title = urlParams.get('title');
const token = urlParams.get('token');

if (message && title && token) {
  // if a message, title, and token are present, check if the token is valid
  const checkTokenValidity = async () => {
    const tokenRef = firebase.firestore().collection('tokens').doc(token);
    const tokenDoc = await tokenRef.get();
    const viewed = tokenDoc.data().viewed;

    if (!viewed) {
      // if the token is valid, show the message and title and mark the token as viewed
      messageElement.innerText = message;
      titleElement.innerText = title;
      await tokenRef.update({ viewed: true });
    } else {
      // if the token has already been viewed, show the default message and title
      messageElement.innerText = 'Enter your message here';
      titleElement.innerText = 'Enter Your Name';
    }
  };
  checkTokenValidity();
} else {
  // if no message, title, or token are present, show the default message and title
  messageElement.innerText = 'Enter your message here';
  titleElement.innerText = 'Enter Your Name';
}
