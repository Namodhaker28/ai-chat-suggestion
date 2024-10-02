const openaiApiKey = process.env.OPENAI_API_KEY;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getSuggestion") {
    const userInput = message.input;

    let didRespond = false;

    // Set a timeout to prevent the port from closing before a response is sent
    const timeout = setTimeout(() => {
      if (!didRespond) {
        console.warn("Forcing response due to timeout");
        sendResponse({ suggestion: "No suggestion available (timeout)." });
      }
    }, 5000); // 5-second timeout
    console.log("Init??");
    fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `The user just entered: ${userInput} give me the suggestions for the next 4 words`,
          },
        ],
        model: "llama3-8b-8192",
        stream: false,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        clearTimeout(timeout); // Clear the timeout when a response is received
        if (data.choices && data.choices.length > 0) {
          const suggestion = data.choices[0].message.content.trim();
          sendResponse({ suggestion: suggestion });
          didRespond = true;
        } else {
          sendResponse({ suggestion: "No suggestion available." });
          didRespond = true;
        }
      })
      .catch((error) => {
        console.error("Error fetching suggestion:", error);
        sendResponse({ suggestion: "Error fetching suggestion." });
        didRespond = true;
      });

    return true; // Keep the message port open for asynchronous response
  }
});
