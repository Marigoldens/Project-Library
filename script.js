"use strict";

// DOM MANIPULATION
const formContainer = document.querySelector(".formContainer");
const addBooksBtn = document.querySelector(".addBooksBtn");

addBooksBtn.addEventListener("click", () => {
  if (formContainer.style.display === "none") {
    formContainer.style.display = "flex";
  } else {
    formContainer.style.display = "none";
  }
});

const submitBtn = document.querySelector("#submitBtn");
submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const bookTitle = document.querySelector("#bookTitle").value;
  const author = document.querySelector("#author").value;
  const pageNum = document.querySelector("#pageNum").value;
  const releaseDate = document.querySelector("#releaseDate").value;
  const read = document.querySelector("#read").checked;
  const bookForm = document.querySelector("#bookForm");
  if (
    bookTitle === "" ||
    author === "" ||
    pageNum === "" ||
    releaseDate === ""
  ) {
    return;
  }
  const newBook = addBookToLibrary(
    bookTitle,
    author,
    pageNum,
    releaseDate,
    read
  );
  bookForm.reset();
  addBookToDOM(bookTitle, author, pageNum, releaseDate, read, newBook.ID);
});

// LOGIC
const myLibrary = [];

class Book {
  constructor(title, author, pageNum, releaseDate, read) {
    this.title = title;
    this.author = author;
    this.pageNum = pageNum;
    this.releaseDate = releaseDate;
    this.read = read;
    this.ID = crypto.randomUUID();
  }

  toggleRead() {
    this.read = !this.read;
  }
}

function addBookToLibrary(title, author, pageNum, releaseDate, read) {
  const book = new Book(title, author, pageNum, releaseDate, read);
  myLibrary.push(book);
  return book;
}

function addBookToDOM(title, author, pageNum, releaseDate, read, bookId) {
  // FOR ADDING CARD TO THE PAGE
  const readOrNot = read ? "READ" : "NOT READ YET";
  const bookContainer = document.querySelector(`.bookContainer`);
  // FOR MAKING THE CARD
  const Container = document.createElement("div");
  Container.setAttribute("class", "Container");
  Container.setAttribute("data-book-id", bookId);

  // FOR REMOVING THE CARD
  const removeBtn = document.createElement("button");
  removeBtn.setAttribute("class", "removeBtn");
  Container.appendChild(removeBtn);
  removeBtn.textContent = "X";
  removeBtn.addEventListener("click", () => {
    const bookIdToRemove = Container.getAttribute("data-book-id");
    // Step 2: Find the correct book in the array
    const bookIndex = myLibrary.findIndex((book) => book.ID === bookIdToRemove);
    if (bookIndex !== -1) {
      myLibrary.splice(bookIndex, 1); // Step 3: Remove the book from the array (if found)
    }
    bookContainer.removeChild(Container);
  });

  // CARD INFO PLACEMENT
  bookContainer.setAttribute("class", "bookContainer");
  const titleContainer = document.createElement(`h1`);
  titleContainer.textContent = title;
  Container.appendChild(titleContainer);
  const authorContainer = document.createElement(`p`);
  authorContainer.textContent = `AUTHOR: ${author}`;
  Container.appendChild(authorContainer);
  const pageNumContainer = document.createElement(`p`);
  pageNumContainer.textContent = `NUMBER OF PAGES: ${pageNum}`;
  Container.appendChild(pageNumContainer);
  const releaseDateContainer = document.createElement(`p`);
  releaseDateContainer.textContent = `RELEASE YEAR: ${releaseDate}`;
  Container.appendChild(releaseDateContainer);
  // READ BTN
  const readContainer = document.createElement(`div`);
  readContainer.setAttribute("class", "readContainer");
  const readBtn = document.createElement("button");
  readBtn.setAttribute("class", "readBtn");
  readBtn.textContent = "STATUS";

  //TOGGLE READ
  readBtn.addEventListener("click", () => {
    const bookToToggle = Container.getAttribute("data-book-id");
    const bookIndex = myLibrary.findIndex((book) => book.ID === bookToToggle);
    myLibrary[bookIndex].toggleRead();
    if (readStatus.textContent === "READ") {
      readStatus.textContent = "UNREAD";
    } else {
      readStatus.textContent = "READ";
    }
  });
  const readStatus = document.createElement("p");
  readStatus.textContent = readOrNot;
  readContainer.appendChild(readBtn);
  readContainer.appendChild(readStatus);
  // APPENDING TO CONTAINER
  Container.appendChild(readContainer);
  bookContainer.appendChild(Container);
}

// Test functions
// Update to:
const book1 = addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 310, 1937, true);
const book2 = addBookToLibrary(
  "Harry Potter and the Sorcerer's Stone",
  "J.K. Rowling",
  309,
  1997,
  true
);
const book3 = addBookToLibrary(
  "The Name of the Wind",
  "Patrick Rothfuss",
  662,
  2007,
  false
);

addBookToDOM("The Hobbit", "J.R.R. Tolkien", 310, 1937, true, book1.ID);
addBookToDOM(
  "Harry Potter and the Sorcerer's Stone",
  "J.K. Rowling",
  309,
  1997,
  true,
  book2.ID
);
addBookToDOM(
  "The Name of the Wind",
  "Patrick Rothfuss",
  662,
  2007,
  false,
  book3.ID
);
