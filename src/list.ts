import { fetchBooks } from "./books.js";
import type { Book } from "./books.js";

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

// Render the page ---------------------------------------------

const render = (books: Book[]) => {
  const number = books.length;
  let itemString = "Books";
  if (number === 1) itemString = "Book";

  total.textContent = `${number} ${itemString} displayed`;

  const tbody = table.querySelector("tbody");
  tbody?.replaceChildren();

  books.forEach((book) => {
    const tr = document.createElement("tr");

    // Create table cells
    const favorite_empty = `
        <button class="button button-clear fav-btn">
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
      favorite = `
            <button class="button button-clear fav-btn">
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

    const row = `
    <tr>
        <td>
            ${favorite_empty}
        </td>
        <td>${book.title}</td>
        <td>${book.isbn}</td>
        <td>${book.author}</td>
        <td>${book.publisher}</td>
        <td>
        <a href="detail.html?isbn=${book.isbn}" class="button">
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

    render(books);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    total.textContent = `Could not load books: ${message}`;
    table.remove();
  }
};

let books: Book[] = [];
refreshBookTable();

// search ---------------------------------------------------------

search.addEventListener("input", async (event) => {
  event.preventDefault();
  let query = "";
  if (search.value.trim() != "") query = `?title_like=${search.value}`;

  refreshBookTable(query);
});
