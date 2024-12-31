// ==UserScript==
// @name         Quick Phrases for Claude.ai
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Quickly insert predefined long phrases in Claude.ai chat
// @match        https://claude.ai/*
// @grant        none
// @author       kenspc
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    // Define long canned sentences, use \n for line breaks
    const phrases = [
        `Hello, I would like to know more about this topic. \nPlease give me some detailed explanation. \nThank you! `,
        `Could you please recommend some relevant resources so that I can study further. \nI'm very interested in this! `,
        `I have some questions about this, can you help me answer them? \nI hope to understand this concept more deeply.`,
        `Please help me summarize this article`
    ];

    let currentTextArea = null; // Store the currently related textarea

    // Create button
    const button = document.createElement('button');
    button.innerText = 'P';
    button.style.zIndex = '1000';
    button.style.padding = '4px 8px';
    button.style.backgroundColor = 'transparent';
    button.style.color = '#666';
    button.style.border = '1px solid #ccc';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.style.width = '28px';
    button.style.height = '28px';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.title = 'Quick Phrases (Alt+P)';

    // Create menu
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.zIndex = '1000';
    menu.style.backgroundColor = '#fff';
    menu.style.border = '1px solid #ccc';
    menu.style.borderRadius = '5px';
    menu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    menu.style.padding = '5px';
    menu.style.display = 'none';
    menu.style.maxHeight = '400px';
    menu.style.overflowY = 'auto';
    menu.style.minWidth = '200px';

    // Find the currently corresponding input element
    const findTargetInput = () => {
        if (currentTextArea) {
            return currentTextArea;
        }
        return document.querySelector('div[contenteditable="true"]');
    };

     // Function to adjust the button position
    const adjustButtonPosition = () => {
        const textareas = document.querySelectorAll('textarea');
        const contentEditableDivs = document.querySelectorAll('div[contenteditable="true"]');

        // First, handle textarea
        let visibleTextarea = null;
        for (const textarea of textareas) {
            const style = window.getComputedStyle(textarea);
            if (style.display !== 'none' && style.visibility !== 'hidden') {
                visibleTextarea = textarea;
                break;
            }
        }

        if (visibleTextarea) {
            currentTextArea = visibleTextarea; // Update the current textarea reference

            // Handle textarea
            button.style.position = 'absolute';
            const textareaRect = visibleTextarea.getBoundingClientRect();
            const parentRect = visibleTextarea.parentElement.getBoundingClientRect();

            // Calculate the button's position, relative to the textarea
            const offsetX = 10; // 10 pixels inward from the right edge
            const offsetY = 5;  // 5 pixels down from the top

            // Set the button's position
            button.style.right = `-${offsetX + button.offsetWidth}px`;
            button.style.top = `${offsetY}px`;

            // Ensure the button is in the correct container
            if (button.parentElement !== visibleTextarea.parentElement) {
                visibleTextarea.parentElement.appendChild(button);
            }
            return; // End function, no longer process contenteditable
        }

        // If no textarea, then handle contenteditable div
        let visibleContentEditableDiv = null;
         for (let i = contentEditableDivs.length - 1; i >= 0; i--) {
            const div = contentEditableDivs[i];
            const style = window.getComputedStyle(div);
            if (style.display !== 'none' && style.visibility !== 'hidden') {
                visibleContentEditableDiv = div;
                break;
            }
        }

        if (visibleContentEditableDiv) {
             // Logic for handling contenteditable div (remains unchanged)
             button.style.position = 'absolute';
             const rect = visibleContentEditableDiv.getBoundingClientRect();

            const offsetX = 10;
            const offsetY = 5;

            button.style.right = `-${offsetX + button.offsetWidth}px`;
            button.style.top = `${offsetY}px`;

            if (button.parentElement !== visibleContentEditableDiv.parentElement) {
                visibleContentEditableDiv.parentElement.appendChild(button);
            }
        }
    };

    // Insert text into the specified element
    const insertText = (element, text) => {
        if (!element) return;

        if (element.tagName.toLowerCase() === 'textarea') {
            const start = element.selectionStart || 0;
            const end = element.selectionEnd || 0;
            const value = element.value;
            element.value = value.substring(0, start) + text + value.substring(end);
            element.selectionStart = element.selectionEnd = start + text.length;
            element.focus();
            element.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            // Handle ProseMirror editor
            element.focus();

            // Clear any placeholder paragraphs
            const emptyP = element.querySelector('p.is-empty');
            if (emptyP) {
                emptyP.remove();
            }

            // Split the text into multiple lines
            const lines = text.split('\n');

            // Create new paragraph elements
            const paragraphs = lines.map(line => {
                const p = document.createElement('p');
                p.textContent = line;
                return p;
            });

            // Insert all paragraphs
            const fragment = document.createDocumentFragment();
            paragraphs.forEach(p => fragment.appendChild(p));

            // If the editor is empty, insert directly
            if (element.children.length === 0) {
                element.appendChild(fragment);
            } else {
                // Insert at the current cursor position
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    let targetNode = range.commonAncestorContainer;

                    // Make sure we are inserting in the correct place
                    while (targetNode && targetNode.parentNode !== element) {
                        targetNode = targetNode.parentNode;
                    }

                    if (targetNode) {
                        element.insertBefore(fragment, targetNode.nextSibling);
                    } else {
                        element.appendChild(fragment);
                    }
                } else {
                    element.appendChild(fragment);
                }
            }

            // Trigger input event to ensure the editor updates
            element.dispatchEvent(new InputEvent('input', {
                bubbles: true,
                cancelable: true
            }));
        }
    };

    // Create menu items
    phrases.forEach((phrase) => {
        const phraseButton = document.createElement('button');
        phraseButton.innerText = phrase.split('\n')[0] + '...';
        phraseButton.style.display = 'block';
        phraseButton.style.width = '100%';
        phraseButton.style.margin = '5px 0';
        phraseButton.style.padding = '10px';
        phraseButton.style.backgroundColor = '#f8f9fa';
        phraseButton.style.border = '1px solid #ccc';
        phraseButton.style.borderRadius = '5px';
        phraseButton.style.cursor = 'pointer';
        phraseButton.style.textAlign = 'left';
        phraseButton.style.color = '#333';

        phraseButton.addEventListener('mouseover', () => {
            phraseButton.style.backgroundColor = '#007BFF';
            phraseButton.style.color = '#fff';
        });

        phraseButton.addEventListener('mouseout', () => {
            phraseButton.style.backgroundColor = '#f8f9fa';
            phraseButton.style.color = '#333';
        });

        // Insert text
        phraseButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission
            e.stopPropagation();
            const targetInput = findTargetInput();
            if (targetInput) {
                insertText(targetInput, phrase);
            }
            menu.style.display = 'none';
            return false; // Further ensure no form submission is triggered
        });

        menu.appendChild(phraseButton);
    });

    // Button click event
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';

        if (menu.style.display === 'block') {
            const buttonRect = button.getBoundingClientRect();
            const menuHeight = menu.offsetHeight;
            const viewportHeight = window.innerHeight;

            // Default to below the button
            let top = buttonRect.bottom + 5;

            // If the menu would go off the bottom of the viewport, move it above the button
            if (top + menuHeight > viewportHeight) {
                top = buttonRect.top - menuHeight - 5;
            }

            // Center horizontally on the button
            const left = buttonRect.left + (buttonRect.width - menu.offsetWidth) / 2;

            menu.style.left = `${left}px`;
            menu.style.top = `${top}px`;
        }
        return false;
    });

     // Ensure the button does not trigger form submission
    button.type = 'button';

    // Shortcut Alt+P
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'p') {
             e.preventDefault();
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
             if (menu.style.display === 'block') {
                const buttonRect = button.getBoundingClientRect();
                 menu.style.left = `${buttonRect.left}px`;
                 menu.style.top = `${buttonRect.bottom + 5}px`;
            }
        }
    });

    // Close menu when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && e.target !== button) {
            menu.style.display = 'none';
        }
    });

    document.body.appendChild(menu);

    // Use a lightweight MutationObserver
    const observer = new MutationObserver(() => {
        if (document.querySelector('textarea') || document.querySelector('div[contenteditable="true"]')) {
            adjustButtonPosition();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // Update button position on page load and resize
    window.addEventListener('resize', adjustButtonPosition);
    window.addEventListener('scroll', adjustButtonPosition);

    // Delay initialization of the button position
    setTimeout(adjustButtonPosition, 1000);
})();