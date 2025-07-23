"use strict";

// --- DOM Elements ---
// Select all necessary DOM elements once at the beginning
const formContainer = document.querySelector(".formContainer");
const addBooksBtn = document.querySelector(".addBooksBtn");
const submitBtn = document.querySelector("#submitBtn"); // Still useful for initial setup, though form.submit handles main logic
const bookForm = document.querySelector("#bookForm");
const bookTitleInput = document.querySelector("#bookTitle");
const authorInput = document.querySelector("#author");
const pageNumInput = document.querySelector("#pageNum");
const releaseDateInput = document.querySelector("#releaseDate");
const readInput = document.querySelector("#read");
const bookDisplayContainer = document.querySelector(".bookContainer");

// --- Library Logic ---
const myLibrary = []; // Array to store all book objects

// Book Class definition
class Book {
  constructor(title, author, pageNum, releaseDate, read) {
    this.title = title;
    this.author = author;
    this.pageNum = pageNum;
    this.releaseDate = releaseDate;
    this.read = read;
    this.ID = crypto.randomUUID(); // Assign a unique ID using Web Crypto API
  }

  // Method to toggle the read status of the book
  toggleRead() {
    this.read = !this.read;
  }
}

// Function to add a new book to the myLibrary array
function addBookToLibrary(title, author, pageNum, releaseDate, read) {
  const book = new Book(title, author, pageNum, releaseDate, read);
  myLibrary.push(book);
  return book; // Return the newly created book object
}

// --- DOM Manipulation Functions ---

// Function to add a book's card to the display in the DOM
function addBookToDOM(book) {
  // Determine initial read status text
  const readOrNotText = book.read ? "READ" : "NOT READ YET";

  // Create the main card container (div)
  const bookCard = document.createElement("div");
  bookCard.setAttribute("class", "Container"); // Matches your CSS class
  bookCard.setAttribute("data-book-id", book.ID); // Link card to book ID

  // Create and append the remove button
  const removeBtn = document.createElement("button");
  removeBtn.setAttribute("class", "removeBtn");
  removeBtn.textContent = "X";
  removeBtn.addEventListener("click", () => {
    // Remove the book from the myLibrary array
    const bookIndex = myLibrary.findIndex((item) => item.ID === book.ID);
    if (bookIndex !== -1) {
      myLibrary.splice(bookIndex, 1);
    }
    // Remove the book card from the DOM
    bookDisplayContainer.removeChild(bookCard);
  });
  bookCard.appendChild(removeBtn);

  // Create and append card info elements
  const titleContainer = document.createElement("h1");
  titleContainer.textContent = book.title;
  bookCard.appendChild(titleContainer);

  const authorContainer = document.createElement("p");
  authorContainer.textContent = `AUTHOR: ${book.author}`;
  bookCard.appendChild(authorContainer);

  const pageNumContainer = document.createElement("p");
  pageNumContainer.textContent = `NUMBER OF PAGES: ${book.pageNum}`;
  bookCard.appendChild(pageNumContainer);

  const releaseDateContainer = document.createElement("p");
  releaseDateContainer.textContent = `RELEASE YEAR: ${book.releaseDate}`;
  bookCard.appendChild(releaseDateContainer);

  // Create and append read status section (button + text)
  const readContainer = document.createElement("div");
  readContainer.setAttribute("class", "readContainer");

  const readBtn = document.createElement("button");
  readBtn.setAttribute("class", "readBtn");
  readBtn.textContent = "STATUS";

  const readStatus = document.createElement("p");
  readStatus.textContent = readOrNotText; // Set initial text

  // Event listener to toggle read status when the button is clicked
  readBtn.addEventListener("click", () => {
    book.toggleRead(); // Toggle the read status in the actual book object
    readStatus.textContent = book.read ? "READ" : "NOT READ YET"; // Update the displayed text
  });

  readContainer.appendChild(readBtn);
  readContainer.appendChild(readStatus);
  bookCard.appendChild(readContainer);

  // Append the complete book card to the main display container
  bookDisplayContainer.appendChild(bookCard);
}

// --- Event Listeners ---

// Event listener for the "Add book" button to toggle form visibility
addBooksBtn.addEventListener("click", () => {
  formContainer.style.display =
    formContainer.style.display === "none" ? "flex" : "none";
});

// Event listener for the form submission, including validation
bookForm.addEventListener("submit", (event) => {
  // Prevent the default form submission behavior (page reload)
  event.preventDefault();

  let hasErrors = false; // Flag to track if any validation errors occur

  // --- Input Validation Logic ---

  // Validate book title
  if (bookTitleInput.value.trim() === "") {
    bookTitleInput.setCustomValidity("Please enter a valid book title.");
    bookTitleInput.reportValidity();
    hasErrors = true;
  } else if (bookTitleInput.value.length < 3) {
    bookTitleInput.setCustomValidity(
      "Book title must be at least 3 characters."
    );
    bookTitleInput.reportValidity();
    hasErrors = true;
  } else {
    bookTitleInput.setCustomValidity(""); // Clear custom validity if valid
  }

  // Validate author
  if (authorInput.value.trim() === "") {
    authorInput.setCustomValidity("Please enter an author name.");
    authorInput.reportValidity();
    hasErrors = true;
  } else if (authorInput.value.length < 3) {
    authorInput.setCustomValidity("Author name must be at least 3 characters.");
    authorInput.reportValidity();
    hasErrors = true;
  } else {
    authorInput.setCustomValidity("");
  }

  // Validate page number
  if (pageNumInput.value.trim() === "") {
    pageNumInput.setCustomValidity("Please enter the number of pages.");
    pageNumInput.reportValidity();
    hasErrors = true;
  } else if (parseInt(pageNumInput.value, 10) <= 0) {
    pageNumInput.setCustomValidity("Page number must be a positive number.");
    pageNumInput.reportValidity();
    hasErrors = true;
  } else {
    pageNumInput.setCustomValidity("");
  }

  // Validate release date (year)
  const currentYear = new Date().getFullYear(); // Get the current year dynamically
  if (releaseDateInput.value.trim() === "") {
    releaseDateInput.setCustomValidity("Please enter the release year.");
    releaseDateInput.reportValidity();
    hasErrors = true;
  } else {
    const releaseYear = parseInt(releaseDateInput.value, 10); // Convert input value to an integer

    if (isNaN(releaseYear)) {
      // Check if the parsed value is not a number
      releaseDateInput.setCustomValidity(
        "Please enter a valid number for the release year."
      );
      releaseDateInput.reportValidity();
      hasErrors = true;
    } else if (releaseYear < 1000 || releaseYear > currentYear) {
      // Check if year is within a valid range
      releaseDateInput.setCustomValidity(
        `Please enter a valid year between 1000 and ${currentYear}.`
      );
      releaseDateInput.reportValidity();
      hasErrors = true;
    } else {
      releaseDateInput.setCustomValidity("");
    }
  }

  // If no validation errors occurred, proceed to add the book
  if (!hasErrors) {
    const newBook = addBookToLibrary(
      bookTitleInput.value,
      authorInput.value,
      pageNumInput.value,
      releaseDateInput.value, // Keep as string for display; convert to number if needed for other ops
      readInput.checked
    );
    addBookToDOM(newBook); // Add the new book's card to the DOM
    bookForm.reset(); // Clear all form fields
    formContainer.style.display = "none"; // Hide the form after successful submission
  }
});
