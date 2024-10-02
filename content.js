console.log('Chat Suggester content script is running.');

const apiKey = process.env.APIKEY;;

// Find the chat input field
const chatInput = document.querySelector('input[type="text"], textarea');

if (chatInput) {
  console.log('Chat input found:', chatInput);

  // Function to show the suggestion
  function showSuggestion(suggestion) {
    let suggestionBox = document.querySelector('.suggestion-box');

    if (!suggestionBox) {
      suggestionBox = document.createElement('div');
      suggestionBox.className = 'suggestion-box';
      suggestionBox.style.position = 'absolute'; // Ensure it's positioned correctly
      suggestionBox.style.zIndex = '1000'; // Ensure it's on top
      chatInput.parentNode.appendChild(suggestionBox);
    }

    // Style the suggestion box
    suggestionBox.innerText = suggestion;
    suggestionBox.style.display = 'block'; // Ensure it's visible
    suggestionBox.style.backgroundColor = '#f1f1f1'; // Simple styling
    suggestionBox.style.padding = '5px';
    suggestionBox.style.border = '1px solid #ccc';
    suggestionBox.style.borderRadius = '4px';
    suggestionBox.style.top = `${chatInput.offsetTop + chatInput.offsetHeight + 5}px`;
    suggestionBox.style.left = `${chatInput.offsetLeft}px`;
    suggestionBox.style.maxWidth = '300px';

    // Allow user to click the suggestion to autofill the input
    suggestionBox.addEventListener('click', () => {
      chatInput.value = suggestion;
      suggestionBox.remove();
    });
  }

  // Debounce function
  function debounce(func, delay) {
    let debounceTimer;
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Function to fetch suggestion from the API
  function handleUserInput() {
    const userInput = chatInput.value;
    if (userInput) {
      console.log('User input detected:', userInput);

      // Make the API call
      fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are an AI language model that continues any text provided to you, without answering questions or adding explanations. When given any input, including questions or incomplete sentences, continue it naturally, providing only the continuation.",
            },
            {
              role: "user",
              content: `"${userInput}"`,
            },
          ],
          model: "llama3-8b-8192",
          stream: false,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("API response:", data);
          if (data.choices && data.choices.length > 0) {
            const suggestion = data.choices[0].message.content.trim();
            console.log('Received suggestion:', suggestion);
            showSuggestion(suggestion);
          } else {
            console.error("No suggestion available.");
            removeSuggestionBox();
          }
        })
        .catch((error) => {
          console.error("Error fetching suggestion:", error);
          removeSuggestionBox();
        });
    } else {
      // If the input is empty, remove the suggestion box
      removeSuggestionBox();
    }
  }

  // Function to remove the suggestion box
  function removeSuggestionBox() {
    const suggestionBox = document.querySelector('.suggestion-box');
    if (suggestionBox) {
      suggestionBox.remove();
    }
  }

  // Apply debounced event listener to the input field to fetch suggestions
  chatInput.addEventListener('input', debounce(handleUserInput, 2000));

} else {
  console.error('No chat input found.');
}
