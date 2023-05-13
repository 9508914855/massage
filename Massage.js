// get elements
const cardElement = document.getElementById('card');
const messageElement = document.getElementById('message');
const shakeButton = document.getElementById('shake-button');
const shareButton = document.getElementById('share-button');

// create share function
const share = async () => {
    try {
        const token = generateToken();
        const shareUrl = `${window.location.origin}${window.location.pathname}?t=${token}`;
        await navigator.share({
            title: 'Custom Message Card',
            text: 'Check out this custom message card',
            url: shareUrl
        });
    } catch (err) {
        alert('Sharing is not supported on this device.');
    }
};

// generate one-time token
const generateToken = () => {
    const randomString = Math.random().toString(36).substring(7);
    const timestamp = Date.now();
    return `${randomString}-${timestamp}`;
};

// add click event listener to shake button
shakeButton.addEventListener('click', () => {
    cardElement.classList.add('shake');
    setTimeout(() => {
        cardElement.classList.remove('shake');
    }, 1000);
});

// add click event listener to share button
shareButton.addEventListener('click', () => {
    if (navigator.share) {
        share();
    } else {
        const token = generateToken();
        const shareUrl = `${window.location.origin}${window.location.pathname}?t=${token}`;
        prompt('Copy this URL and share it with others:', shareUrl);
    }
});

// check if token is in URL parameters and display message if it is valid
const urlParams = new URLSearchParams(window.location.search);
const tokenParam = urlParams.get('t');
const validToken = localStorage.getItem('validToken');
if (tokenParam && tokenParam === validToken) {
    messageElement.innerText = 'Enter your message here';
    localStorage.removeItem('validToken');
} else {
    messageElement.innerText = 'Enter your message here';
}

// store new token in localStorage and remove previous one
const newToken = generateToken();
localStorage.setItem('validToken', newToken);
