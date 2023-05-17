// Generate a unique token using MD5 hashing algorithm
const generateToken = (message) => {
  const hash = CryptoJS.MD5(message).toString();
  return hash.substring(0, 8);
};

// Add click event2 listener to share button
shareButton.addEventListener('click', () => {
  const message = messageElement.innerText;
  const title = titleElement.innerText;
  
  // Generate a token based on the message content
  const token = generateToken(message);
  
  // Create the share URL with the message, title, and token as query parameters
  const shareUrl = `${window.location.origin}${window.location.pathname}?message=${encodeURIComponent(message)}&title=${encodeURIComponent(title)}&token=${encodeURIComponent(token)}`;
  
  // Show share dialog if supported, otherwise prompt user to copy the link
  if (navigator.share) {
    navigator.share({
      title: 'Custom Message Card',
      text: 'Click 👉',
      url: shareUrl,
    });
  } else {
    prompt('Copy this URL and share it with others:', shareUrl);
  }
});
