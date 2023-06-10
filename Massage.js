document.addEventListener('DOMContentLoaded', () => {
  const cardElement = document.getElementById('card');
  const messageElement = document.getElementById('message');
  const titleElement = document.getElementById('title');
  const shareButton = document.getElementById('share-button');
  const infoButton = document.getElementById('info-button');

  // Email configuration
  const notificationEmail = 'Contact9508914855@gmail.com';
  const subject = 'New URL Saved';

  // generate a random token and store it in local storage
  const generateToken = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  // add click event listener to share button
  shareButton.addEventListener('click', async () => {
    // generate a new token and create a share link with the message, title, and token in the query parameters
    const token = generateToken();
    const shareUrl = `${window.location.origin}${window.location.pathname}?message=${encodeURIComponent(
      messageElement.innerText
    )}&title=${encodeURIComponent(titleElement.innerText)}&token=${encodeURIComponent(token)}`;

    // Make a POST request to the API endpoint to shorten the URL
    fetch('https://bitelink.000webhostapp.com/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ longUrl: shareUrl }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          const shortUrl = data.shortUrl;
          // auto open WhatsApp with the generated short link
          const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
            `Click 👉 ${shortUrl}`
          )}`;
          window.open(whatsappUrl, '_blank');

          // Send email notification
          const emailData = {
            to: notificationEmail,
            subject: subject,
            message: `A new URL has been saved:\n\nLong URL: ${shareUrl}\nShort URL: ${shortUrl}`,
          };
          fetch('https://your-email-service.com/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
          })
            .then(response => response.json())
            .then(emailResponse => {
              if (emailResponse.status !== 'success') {
                console.error('Failed to send email notification:', emailResponse.message);
              }
            })
            .catch(error => {
              console.error('Failed to send email notification:', error.message);
            });
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => {
        alert('Error: ' + error.message);
      });
  });

  // add click event listener to info button
  infoButton.addEventListener('click', () => {
    alert(
      'Introducing the latest tool by Shashi: the One-Time Message Sender. Iss tool ki madad se aap kisi ko message bhej sakte ho, jo sirf ek baar dikhayi dega, phir hamesha ke liye delete ho jaayega. Yeh tool sensitive information aur private conversations ke liye accha option hai.'
    );
  });

  // Rest of the code remains the same...
});
