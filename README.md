# Quick Phrases for Claude.ai

This Tampermonkey script provides a convenient way to insert predefined phrases into the Claude.ai chat interface, enhancing your productivity and saving you time from typing repetitive text.

## Introduction

The `Quick Phrases for Claude.ai` script adds a small button labeled "P" next to the chat input field on the Claude.ai website. Clicking this button opens a menu containing predefined long phrases. These phrases are useful for providing instructions, asking questions, or any repetitive text you use frequently when interacting with Claude. You can also use the shortcut `Alt+P` to toggle the menu.

## Installation

1.  **Install Tampermonkey:**
    -   If you haven't already, install the Tampermonkey browser extension for your browser:
        -   [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
        -   [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
        -   [Safari](https://safari-extensions.apple.com/details/?id=net.tampermonkey.tampermonkey-G36L9V4QY6)
        -   [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
2.  **Install the Script:**
    -   Copy the entire code from the [script file](https://github.com/kenspc/claude-quick-phrases/blob/master/Quick%20Phrases%20for%20Claude.ai.js).
    -   Click on the Tampermonkey icon in your browser's toolbar.
    -   Select "Create a new script..." or "Add a new script..." (The exact wording may vary slightly based on your Tampermonkey version.)
    -   Delete the default code and paste the copied script into the editor.
    -   Save the script (usually by pressing `Ctrl + S` or `Cmd + S`).
3.  **Verify Installation:**
    -   Navigate to the [Claude.ai website](https://claude.ai/).
    -   You should see a small button labeled "P" next to the chat input.

## Usage

1.  **Open Claude.ai:**
    -   Go to the [Claude.ai website](https://claude.ai/).
2.  **Locate the Button:**
    -   A "P" button will be positioned near the chat input field.
3.  **Open the Menu:**
    -   Click the "P" button to display the menu of predefined phrases.
    -   Alternatively, you can press `Alt+P` to open or close the menu.
4.  **Select a Phrase:**
    -   Click on any phrase in the menu. This action will insert the selected phrase into the chat input.
5.  **Edit and Send:**
    -   You can now edit the inserted phrase as needed before pressing enter or clicking submit.

## Customization

-   The phrases are defined in the `phrases` array within the script.
-   To change or add phrases, open the Tampermonkey script editor and modify the strings inside the `phrases` array.  Use `\n` to add line breaks in a phrase.
-   Save the modified script.

## Note
- The button will be positioned on the right side of the input field or textarea, where the position is dynamic based on the available textarea or contenteditable div on the page.

## Contributing

If you have suggestions or find any bugs, please feel free to open an issue on the [GitHub repo](https://github.com/kenspc/claude-quick-phrases).

## License

This script is licensed under the MIT License.
