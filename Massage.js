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
