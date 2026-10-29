import { fetchBooks } from "./books.js";
import type { Book } from "./books.js";

import {
  inverseInFavorites,
  addToFavorites,
  loadFavorites,
} from "./favorites.js";
import type { FavoriteBook } from "./favorites.js";

// Get all HTML elements -------------------------------------
const total = document.getElementById("total");
if (!(total instanceof HTMLHeadingElement)) {
  throw new Error("Element #total not found");
}
const table = document.getElementById("books-table");
if (!(table instanceof HTMLTableElement)) {
  throw new Error("Element #books-table not found");
}
const search = document.getElementById("search");
if (!(search instanceof HTMLInputElement)) {
  throw new Error("Element #search not found");
}
const publisherSelect = document.getElementById("by-publisher");
if (!(publisherSelect instanceof HTMLSelectElement)) {
  throw new Error("Element #by-publisher not found");
}

// Render the page ---------------------------------------------

const render = (books: Book[]) => {
  const number = books.length;
  let itemString = "Books";
  if (number === 1) itemString = "Book";

  total.textContent = `${number} ${itemString} displayed`;

  const tbody = table.querySelector("tbody");
  tbody?.replaceChildren();

  let favorites: FavoriteBook[] = loadFavorites();

  books.forEach((book) => {
    const tr = document.createElement("tr");

    // Create table cells
    const favorite_empty = `
        <button class="button button-clear fav-btn" data-id="${book.id}">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="fav"
            >
                <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
            </svg>
        </button>
        `,
      favorite_fill = `
            <button class="button button-clear fav-btn" data-id="${book.id}"> 
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="fav"
                    >
                      <path
                        d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                      />
                    </svg>
            </button>
        `;
    let favorite: string;

    const favoriteBook = favorites.find(
      (favoriteBook) => favoriteBook.id === book.id,
    );

    if (favoriteBook) {
      favorite = favorite_fill;
    } else {
      favorite = favorite_empty;
    }

    const row = `
    <tr>
        <td>
            ${favorite}
        </td>
        <td>${book.title}</td>
        <td>${book.isbn}</td>
        <td>${book.author}</td>
        <td>${book.publisher}</td>
        <td>
        <a href="detail?isbn=${book.isbn}" class="button">
            Detail
        </a>
        </td>
    </tr>
    `;

    if (tbody) tbody.insertAdjacentHTML("beforeend", row);
  });
};

// Fetch books -------------------------------------------------
const refreshBookTable = async (query?: string) => {
  try {
    if (!query) query = "";
    books = await fetchBooks("/books" + query);

    if (publishers.length === 0) publishers = createPublishers(books);

    render(books);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    total.textContent = `Could not load books: ${message}`;
    table.remove();
  }
};

// search ---------------------------------------------------------

search.addEventListener("input", async (event) => {
  refreshBookTable(buildSearchQuery(search.value, publisherSelect.value));
});

function buildSearchQuery(
  searchQuery: string,
  currentPublisher: string,
): string {
  let query = "";
  if (searchQuery.trim() != "") query = `?title_like=${searchQuery}`;

  let symb = "?";
  if (query.length > 0) symb = "&";
  if (currentPublisher != "-") query += `${symb}publisher=${currentPublisher}`;
  return query;
}

// publisherSelect -------------------------------------------------

function createPublishers(books: Book[]): string[] {
  let publishers = [...new Set(books.map((book) => book.publisher))];

  if (publisherSelect instanceof HTMLSelectElement) {
    publisherSelect.replaceChildren(new Option("-", "-"));

    publishers.forEach((publisher) => {
      publisherSelect.add(new Option(publisher, publisher));
    });
  }

  return publishers;
}

publisherSelect.addEventListener("change", async (event) => {
  refreshBookTable(buildSearchQuery(search.value, publisherSelect.value));
});

// MAIN -------------------------------------------------
let books: Book[] = [],
  publishers: string[] = [];

refreshBookTable();

document.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof Element) {
    const button = target.closest(".fav-btn");

    if (button instanceof HTMLButtonElement) {
      const id = button.dataset.id;
      const book = books.find((book) => book.id === id);
      if (book) inverseInFavorites(book);
      render(books);
    }
  }
});
