const BOOK_API = "http://localhost:4730";

export interface Book {
  id: string;
  isbn: string;
  title: string;
  subtitle: string;
  abstract: string;
  author: string;
  publisher: string;
  price: number;
  currency: string;
  numPages: number;
  cover: string;
  userId: number;
  publishedAt: string;
  coAuthors: string[];
  predecessorIsbn: string;
  successorIsbn: string;
  createdAt: string;
  updatedAt: string;
}

function isBook(value: unknown): value is Book {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "isbn" in value &&
    typeof value.isbn === "string" &&
    "title" in value &&
    typeof value.title === "string" &&
    // "subtitle" in value &&
    // typeof value.subtitle === "string" &&
    // "abstract" in value &&
    // typeof value.abstract === "string" &&
    "author" in value &&
    typeof value.author === "string" &&
    "publisher" in value &&
    typeof value.publisher === "string" //&&
    // "price" in value &&
    // typeof value.price === "number" &&
    // "currency" in value &&
    // typeof value.currency === "string" &&
    // "numPages" in value &&
    // typeof value.numPages === "number" &&
    // "cover" in value &&
    // typeof value.cover === "string" &&
    // "userId" in value &&
    // typeof value.userId === "number" &&
    // "publishedAt" in value &&
    // typeof value.publishedAt === "string" &&
    // "coAuthors" in value &&
    // Array.isArray(value.coAuthors) &&
    // "predecessorIsbn" in value &&
    // typeof value.predecessorIsbn === "string" &&
    // "successorIsbn" in value &&
    // typeof value.successorIsbn === "string" &&
    // "createdAt" in value &&
    // typeof value.createdAt === "string" &&
    // "updatedAt" in value &&
    // typeof value.updatedAt === "string"
  );
}

export async function fetchBooks(url: string): Promise<Book[]> {
  const response = await fetch(BOOK_API + url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();

  if (Array.isArray(data)) return data.filter(isBook);
  //if (Array.isArray(data)) return data;
  else throw new Error(`Request failed with status ${response.status}`);
}
