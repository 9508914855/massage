const cardElement = document.querySelector('.card');
const messageElement = document.getElementById('message');
const titleElement = document.getElementById('title');
const shareButton = document.getElementById('share-button');
const infoButton = document.getElementById('info-button');
const linkContainer = document.getElementById('link-container');

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

// Add click event listener to share button
shareButton.addEventListener('click', async () => {
  const token = generateToken();

  // Generate or load encryption key based on the token
  const encryptionKey = await generateOrLoadEncryptionKey(token);

  // Encrypt the message using the encryption key
  const encryptedMessage = await encryptMessage(messageElement.innerText, encryptionKey);

  // Convert the encrypted message and token to URL-safe strings
  const urlParams = new URLSearchParams();
  urlParams.set('encryptedMessage', JSON.stringify(encryptedMessage));
  urlParams.set('token', token);

  // Generate the share URL
  const shareUrl = `${window.location.origin}${window.location.pathname}?${urlParams}`;

  // shorten the shareUrl using TinyURL API
  const apiEndpoint = 'https://tinyurl.com/api-create.php';
  const response = await fetch(`${apiEndpoint}?url=${encodeURIComponent(shareUrl)}`);
  const shortUrl = await response.text();



// Clear the link container and append the link element
linkContainer.innerHTML = '';
linkContainer.appendChild(linkElement);

// Show the link container
linkContainer.style.display = 'block';
});

// Add click event listener to info button
infoButton.addEventListener('click', () => {
alert('Introducing the latest tool: the One-Time Message Sender. This tool allows you to send a message that can only be viewed once and then gets deleted permanently. It\'s a great option for sharing sensitive information and having private conversations.');
});

// Check if an encrypted message and token are present in the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const encryptedMessageParam = urlParams.get('encryptedMessage');
const token = urlParams.get('token');

if (encryptedMessageParam && token) {
// Generate or load encryption key based on the token
generateOrLoadEncryptionKey(token).then(encryptionKey => {
  if (encryptionKey) {
    try {
      const encryptedMessage = JSON.parse(encryptedMessageParam);

      // Decrypt the encrypted message using the encryption key
      decryptMessage(encryptedMessage, encryptionKey).then(decryptedMessage => {
        // Show the decrypted message
        messageElement.innerText = decryptedMessage;
        titleElement.innerText = 'Decrypted Message';
      }).catch(error => {
        console.error('Failed to decrypt the message:', error);
        messageElement.innerText = 'Failed to decrypt the message.';
        titleElement.innerText = 'Error';
      });
    } catch (error) {
      console.error('Failed to parse the encrypted message:', error);
      messageElement.innerText = 'Failed to parse the encrypted message.';
      titleElement.innerText = 'Error';
    }
  } else {
    console.error('Failed to generate or load encryption key for the token:', token);
    messageElement.innerText = 'Failed to decrypt the message.';
    titleElement.innerText = 'Error';
  }
});
} else {
// If no encrypted message or token are present, show the default message and title
messageElement.innerText = 'Enter your message here';
titleElement.innerText = 'Enter Your Name';
}

