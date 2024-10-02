document.addEventListener('DOMContentLoaded', function () {
    const enableSuggestionsCheckbox = document.getElementById('enableSuggestions');
    
    // Load saved state from storage
    chrome.storage.sync.get('suggestionsEnabled', function (data) {
      enableSuggestionsCheckbox.checked = data.suggestionsEnabled || false;
    });
    
    // Save the user's preference
    enableSuggestionsCheckbox.addEventListener('change', function () {
      chrome.storage.sync.set({ suggestionsEnabled: enableSuggestionsCheckbox.checked });
    });
  });
  