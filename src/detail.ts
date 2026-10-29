import type { Book } from "./books.js";
import { fetchBook } from "./books.js";
import { loadFavorites } from "./favorites.js";

// Get all HTML elements -------------------------------------
const bookTitle = document.getElementById("book-title");
if (!(bookTitle instanceof HTMLHeadingElement)) {
  throw new Error("Element #book-title not found");
}
const bookAbstract = document.getElementById("book-abstract");
if (!(bookAbstract instanceof HTMLParagraphElement)) {
  throw new Error("Element #book-abstract not found");
}
const bookAuthor = document.getElementById("book-author");
if (!(bookAuthor instanceof HTMLSpanElement)) {
  throw new Error("Element #book-author not found");
}
const bookPublisher = document.getElementById("book-publisher");
if (!(bookPublisher instanceof HTMLSpanElement)) {
  throw new Error("Element #book-publisher not found");
}
const bookPages = document.getElementById("book-pages");
if (!(bookPages instanceof HTMLSpanElement)) {
  throw new Error("Element #book-pages not found");
}
const bookCover = document.getElementById("book-cover");
if (!(bookCover instanceof HTMLImageElement)) {
  throw new Error("Element #book-cover not found");
}

// Render the page ---------------------------------------------

const render = (book: Book) => {
  let subtitle = "";
  if (book.subtitle) subtitle = `<br><small>${book.subtitle}</small>`;
  bookTitle.innerHTML = `${book.title}${subtitle}`;

  bookAbstract.textContent = book.abstract;
  bookAuthor.textContent = book.author;
  bookPublisher.textContent = book.publisher;
  bookPages.textContent = book.numPages.toString();
  bookCover.src = book.cover;

  const backButton = document.getElementById("back");
  let buttons = "";

  if (book.predecessorIsbn) {
    buttons += `<a href="detail?isbn=${book.predecessorIsbn}" class="button button-outline">Previous volume</a>`;
  }

  if (book.successorIsbn) {
    buttons += `<a href="detail?isbn=${book.successorIsbn}" class="button button-outline">Next volume</a>`;
  }

  if (backButton) {
    backButton.insertAdjacentHTML("afterend", buttons);
  }
};

// MAIN -------------------------------------------------
const params = new URLSearchParams(window.location.search);
const isbn = params.get("isbn");

try {
  if (isbn) {
    let book = await fetchBook(isbn);
    render(book);
    loadFavorites();
  }
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  bookTitle.textContent = message;

  bookAbstract.textContent = "";
  bookAuthor.textContent = "";
  bookPublisher.textContent = "";
  bookPages.textContent = "";
  bookCover.src = "";
}
