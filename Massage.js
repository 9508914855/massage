// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARmfvuovDozZbATHUeLKJusAQIlX9quZg",
  authDomain: "otm-token.firebaseapp.com",
  databaseURL: "https://otm-token-default-rtdb.firebaseio.com",
  projectId: "otm-token",
  storageBucket: "otm-token.appspot.com",
  messagingSenderId: "1025630374060",
  appId: "1:1025630374060:web:a3dedf10e3cb0846a0f709",
  measurementId: "G-EJCBQTK3B8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const cardElement = document.getElementById('card'); 
const messageElement = document.getElementById('message'); 
const titleElement = document.getElementById('title'); 
const shareButton = document.getElementById('share-button'); 
const infoButton = document.getElementById('info-button'); 

// generate a random token and store it in Firestore
const generateToken = () => { 
  const token = Math.random().toString(36).substr(2, 9);
  db.collection('tokens').doc(token).set({
    used: false
  });
  return token;
}; 

// add click event listener to share button
shareButton.addEventListener('click', () => { 
  // generate a new token and create a share link with the message, title, and token in the query parameters
  const token = generateToken(); 
  const shareUrl = `${window.location.origin}${window.location.pathname}?message=${encodeURIComponent(messageElement.innerText)}&title=${encodeURIComponent(titleElement.innerText)}&key=${encodeURIComponent(token)}`; 

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
  const tokenRef = db.collection('tokens').doc(key);
  tokenRef.get().then((doc) => {
    if (doc.exists && !doc.data().used) {
      // if the key is valid and has not been used before, show the message and title, mark the token as used, and update the database
      messageElement.innerText = message; 
      titleElement.innerText = title; 
      tokenRef.update({
        used: true
      });
    } else { 
      // if the key has already been used before or is invalid, show an error message
      messageElement.innerText = 'This message has already been viewed.'; 
      titleElement.innerText = 'Invalid Key'; 
    }
  }).catch((error) => {
    console.error('Error checking token:', error);
