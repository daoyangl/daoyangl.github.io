# Components Directory

This directory contains modular HTML components for the personal website.

## Structure

- `bio.html` - Contains the Bio/About section content
- `publication.html` - Contains the Publications section content  
- `education.html` - Contains the Education section content

## Usage

These components are automatically loaded into the main `index.html` file using JavaScript. The components maintain the same styling and structure as the original sections.

## Benefits

- **Maintainability**: Each section can be updated independently
- **Modularity**: Easy to add, remove, or reorder sections
- **Reusability**: Components can be reused in other pages if needed
- **Clean Code**: Main index.html is now more focused and readable

## How it works

The main `index.html` file uses JavaScript's `fetch()` API to load each component dynamically when the page loads. The components are inserted into designated container divs:

- `#bio-container` - loads `bio.html`
- `#publication-container` - loads `publication.html` 
- `#education-container` - loads `education.html`
