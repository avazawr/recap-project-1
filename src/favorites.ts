import type { Book } from "./books.js";

export type FavoriteBook = Pick<
  Book,
  "id" | "isbn" | "title" | "author" | "publisher"
>;

function isFavoriteBook(value: unknown): value is FavoriteBook {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "isbn" in value &&
    typeof value.isbn === "string" &&
    "title" in value &&
    typeof value.title === "string" &&
    "author" in value &&
    typeof value.author === "string" &&
    "publisher" in value &&
    typeof value.publisher === "string"
  );
}

const headerFavTotal = document.getElementById("header-fav-total");
if (!(headerFavTotal instanceof HTMLSpanElement)) {
  throw new Error("Element #header-fav-total not found");
}

export function loadFavorites(): FavoriteBook[] {
  const favoriteBooksStorage: unknown =
    localStorage.getItem("favorites-books") ?? "[]";

  if (typeof favoriteBooksStorage !== "string") {
    return [];
  }

  const favoriteBooksParsed = JSON.parse(favoriteBooksStorage);

  if (headerFavTotal) headerFavTotal.textContent = favoriteBooksParsed.length;

  return favoriteBooksParsed.filter(isFavoriteBook);
}

function saveFavorites(favoriteBooks: FavoriteBook[]): void {
  localStorage.setItem("favorites-books", JSON.stringify(favoriteBooks));
}

export function removeFromFavorites(id: string): void {
  const favoriteBooks = loadFavorites();
  const updatedFavorites = favoriteBooks.filter((book) => book.id !== id);
  saveFavorites(updatedFavorites);
}

export function addToFavorites(book: Book): void {
  const favoriteBooks = loadFavorites();
  const favoritebook = {
    id: book.id,
    isbn: book.isbn,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
  };
  favoriteBooks.push(favoritebook);
  saveFavorites(favoriteBooks);
}

export function inverseInFavorites(book: Book): void {
  const favoriteBooks = loadFavorites();
  const favoriteBook = favoriteBooks.find(
    (favoriteBook) => favoriteBook.id === book.id,
  );

  if (favoriteBook) {
    removeFromFavorites(book.id);
  } else {
    addToFavorites(book);
  }
}
