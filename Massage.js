// This script creates a one-time message viewer.

// Get the elements.
var infoButton = document.getElementById("info-button");
var card = document.getElementById("card");
var title = document.getElementById("title");
var message = document.getElementById("message");
var shareButton = document.getElementById("share-button");
var linkContainer = document.getElementById("link-container");

// Set up the event listeners.
infoButton.addEventListener("click", showInfo);
shareButton.addEventListener("click", createLink);

// This function shows the information about the one-time message viewer.
function showInfo() {
  var info = `
    <h2>One-time message viewer</h2>
    <p>This is a one-time message viewer. You can enter a message and then click the "Share" button to generate a link. The link will only work once.</p>
    <p>The message will be deleted after it has been viewed.</p>
  `;

  var infoDiv = document.createElement("div");
  infoDiv.innerHTML = info;
  card.appendChild(infoDiv);
}

// This function creates a link to the one-time message.
function createLink() {
  var messageText = title.textContent + ": " + message.textContent;
  var link = document.createElement("a");
  link.href = "/message/" + encodeURIComponent(messageText);
  link.textContent = "View message";
  linkContainer.appendChild(link);

  // Delete the message after it has been viewed.
  link.addEventListener("click", function() {
    title.textContent = "";
    message.textContent = "";
  });
}

// Generate a random encryption key
function generateEncryptionKey() {
  return window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
}

// Encrypt the message using the encryption key
function encryptMessage(message, encryptionKey) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  return window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    encryptionKey,
    data
  ).then(ciphertext => {
    const encryptedMessage = {
      iv: Array.from(iv),
      ciphertext: Array.from(new Uint8Array(ciphertext))
    };
    return encryptedMessage;
  });
}

// Decrypt the encrypted message using the encryption key
function decryptMessage(encryptedMessage, encryptionKey) {
  const { iv, ciphertext } = encryptedMessage;

  return window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(iv)
    },
    encryptionKey,
    new Uint8Array(ciphertext)
  ).then(decryptedData => {
    const decoder = new TextDecoder();
    const decryptedMessage = decoder.decode(decryptedData);
    return decryptedMessage;
  });
}

// Generate a random token
function generateToken() {
  return Math.random().toString(36).substr(2, 9);
}

// Generate or load encryption key based on the token
function generateOrLoadEncryptionKey(token) {
  const storedEncryptionKey = localStorage.getItem(token);

  if (storedEncryptionKey) {
    const keyData = JSON.parse(storedEncryptionKey);
    const keyUsages = ['encrypt', 'decrypt'];

    return window.crypto.subtle.importKey(
      'jwk',
      keyData,
      { name: 'AES-GCM' },
      true,
      keyUsages
    );
  } else {
    return generateEncryptionKey().then(key => {
      const keyData = JSON.stringify(key);
      localStorage.setItem(token, keyData);
      return key;
    });
  }
}

// Add click event listener
