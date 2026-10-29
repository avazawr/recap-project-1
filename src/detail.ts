import type { Book } from "./books.js";
import { fetchBook } from "./books.js";

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
};

// MAIN -------------------------------------------------
const params = new URLSearchParams(window.location.search);
const isbn = params.get("isbn");

try {
  if (isbn) {
    let book = await fetchBook(isbn);
    render(book);
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
