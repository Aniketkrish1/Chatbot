/**
 * Sends a message to the chat server and displays the user's message
 * and the bot's response in the chat box.
 */
async function sendMessage() {
    // Get input values
    const promptInput = document.getElementById('prompt');
    const imgUrlInput = document.getElementById('img-url');
    const chatBox = document.getElementById('chat-box');

    const prompt = promptInput.value;
    const imgUrl = imgUrlInput.value;

    // Create and append user's message element
    const userMessageElement = document.createElement('div');
    userMessageElement.classList.add('message', 'user');
    userMessageElement.innerHTML = `<strong>User:</strong> ${prompt}`;

    if (imgUrl) {
        const imgElement = document.createElement('img');
        imgElement.src = imgUrl;
        imgElement.alt = 'User provided image';
        imgElement.classList.add('user-image');
        userMessageElement.appendChild(imgElement);
    }

    chatBox.appendChild(userMessageElement);

    // Clear the input fields
    promptInput.value = '';
    imgUrlInput.value = '';

    try {
        // Send POST request to the chat server
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                img_url: imgUrl
            })
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        // Parse the JSON response
        const { content } = await response.json();

        // Create and append bot's message element
        const botMessageElement = document.createElement('div');
        botMessageElement.classList.add('message', 'bot');
        botMessageElement.innerHTML = `<strong>Bot:</strong> ${content}`;
        chatBox.appendChild(botMessageElement);

        // Scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error('Error sending message:', error);
        
        // Optionally, display an error message in the chat box
        const errorMessageElement = document.createElement('div');
        errorMessageElement.classList.add('message', 'error');
        errorMessageElement.innerHTML = '<strong>Error:</strong> Error sending message. Please try again.';
        chatBox.appendChild(errorMessageElement);
    }
}

// Add event listener for Enter key on input fields
document.getElementById('prompt').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('img-url').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
