// console.log('Chat Suggester content script is running.');

// // Find the chat input field
// const chatInput = document.querySelector('input[type="text"], textarea');

// if (chatInput) {
//   console.log('Chat input found:', chatInput);

//   // Function to show the suggestion
//   function showSuggestion(suggestion) {
//     let suggestionBox = document.querySelector('.suggestion-box');
    
//     if (!suggestionBox) {
//       suggestionBox = document.createElement('div');
//       suggestionBox.className = 'suggestion-box';
//       suggestionBox.style.position = 'absolute'; // Ensure it's positioned correctly
//       chatInput.parentNode.appendChild(suggestionBox);
//     }

//     // Style the suggestion box
//     suggestionBox.innerText = suggestion;
//     suggestionBox.style.display = 'block'; // Ensure it's visible
//     suggestionBox.style.backgroundColor = '#f1f1f1'; // Simple styling
//     suggestionBox.style.padding = '5px';
//     suggestionBox.style.border = '1px solid #ccc';
//     suggestionBox.style.top = `${chatInput.offsetTop + chatInput.offsetHeight}px`;
//     suggestionBox.style.left = `${chatInput.offsetLeft}px`;

//     // Allow user to click the suggestion to autofill the input
//     suggestionBox.addEventListener('click', () => {
//       chatInput.value = suggestion;
//       suggestionBox.remove();
//     });
//   }

//   // Function to fetch suggestion from the background script
//   function handleUserInput() {
//     const userInput = chatInput.value;
//     if (userInput) {
//       console.log('User input detected:', userInput);
//       // Send the user's input to the background script to get suggestions
//       fetch("https://api.groq.com/openai/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer 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`,
//         },
//         body: JSON.stringify({
//           messages: [
//             {
//               role: "user",
//               content: `The user just entered: ${userInput} give me the suggestions for the next 4 words`,
//             },
//           ],
//           model: "llama3-8b-8192",
//           stream: false,
//         }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//             console.log("responsexx", data);
//           clearTimeout(timeout); // Clear the timeout when a response is received
//           if (data.choices && data.choices.length > 0) {
//             const suggestion = data.choices[0].message.content.trim();
//             sendResponse({ suggestion: suggestion });
//             didRespond = true;
//           } else {
//             sendResponse({ suggestion: "No suggestion available." });
//             didRespond = true;
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching suggestion:", error);
//           sendResponse({ suggestion: "Error fetching suggestion." });
//           didRespond = true;
//         });

//     //   chrome.runtime.sendMessage({ action: 'getSuggestion', input: userInput }, function (response) {
//     //     if (chrome.runtime.lastError) {
//     //       console.error('Error:', chrome.runtime.lastError.message);
//     //     } else if (response && response.suggestion) {
//     //       console.log('Received suggestion:', response.suggestion);
//     //       showSuggestion(response.suggestion);
//     //     }
//     //   });
//     }
//   }

//   // Apply debounced event listener to the input field to fetch suggestions
//   function debounce(func, delay) {
//     let debounceTimer;
//     return function (...args) {
//       clearTimeout(debounceTimer);
//       debounceTimer = setTimeout(() => func.apply(this, args), delay);
//     };
//   }

//   chatInput.addEventListener('input', debounce(handleUserInput, 300));

// } else {
//   console.error('No chat input found.');
// }
