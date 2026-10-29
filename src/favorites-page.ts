import type { FavoriteBook } from "./favorites.js";
import { loadFavorites, removeFromFavorites } from "./favorites.js";

// Get all HTML elements -------------------------------------
const total = document.getElementById("total");
if (!(total instanceof HTMLHeadingElement)) {
  throw new Error("Element #total not found");
}
const table = document.getElementById("books-table");
if (!(table instanceof HTMLTableElement)) {
  throw new Error("Element #books-table not found");
}

// Render the page ---------------------------------------------

const render = (books: FavoriteBook[]) => {
  const number = books.length;
  let itemString = "Favorites";
  if (number === 1) itemString = "Favorite";

  total.textContent = `${number} ${itemString} on your list`;

  const tbody = table.querySelector("tbody");
  tbody?.replaceChildren();

  books.forEach((book) => {
    const tr = document.createElement("tr");

    // Create table cells
    const favorite_empty = "";

    const row = `
    <tr>
        <td>
            <button class="button button-clear fav-btn fav-btn-del" data-id="${book.id}">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="fav"
            >
                <path
                fill-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                clip-rule="evenodd"
                />
            </svg>
            </button>
            
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

// Main --------------------------------------------------------------
let favoriteBooks: FavoriteBook[] = loadFavorites();
render(favoriteBooks);

document.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof Element) {
    const button = target.closest(".fav-btn-del");
    if (button instanceof HTMLButtonElement) {
      const id = button.dataset.id;
      if (id) {
        removeFromFavorites(id);
        render(loadFavorites());
      }
    }
  }
});
