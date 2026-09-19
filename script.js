// PageTrail - keeps track of books in localStorage

let books = JSON.parse(localStorage.getItem("pagetrail-books")) || [];

function save() {
  localStorage.setItem("pagetrail-books", JSON.stringify(books));
}

function render() {
  const statuses = ["want", "reading", "read"];

  statuses.forEach(function (status) {
    const list = document.getElementById(status + "-list");
    const empty = document.getElementById(status + "-empty");
    const count = document.getElementById(status + "-count");

    const shelfBooks = books.filter(function (b) {
      return b.status === status;
    });

    count.textContent = shelfBooks.length;
    empty.style.display = shelfBooks.length === 0 ? "block" : "none";
    list.innerHTML = "";

    shelfBooks.forEach(function (book) {
      const li = document.createElement("li");
      li.className = "book-row";
      li.style.setProperty("--status-color", "var(--" + book.status + ")");

      let starsHTML = "";
      if (book.status === "read") {
        starsHTML = '<div class="stars">';
        for (let i = 1; i <= 5; i++) {
          const filled = i <= book.rating ? "filled" : "";
          starsHTML += '<button class="' + filled + '" onclick="rateBook(' + book.id + ', ' + i + ')">' +
            (i <= book.rating ? "★" : "☆") + "</button>";
        }
        starsHTML += "</div>";
      }

      li.innerHTML =
        '<div class="book-info">' +
          '<div class="book-title">' + book.title + "</div>" +
          '<div class="book-author">' + book.author + "</div>" +
        "</div>" +
        '<div class="row-controls">' +
          '<select onchange="moveBook(' + book.id + ', this.value)">' +
            '<option value="want"' + (book.status === "want" ? " selected" : "") + ">Want to read</option>" +
            '<option value="reading"' + (book.status === "reading" ? " selected" : "") + ">Reading</option>" +
            '<option value="read"' + (book.status === "read" ? " selected" : "") + ">Read</option>" +
          "</select>" +
          starsHTML +
          '<button class="delete-btn" onclick="deleteBook(' + book.id + ')">Remove</button>' +
        "</div>";

      list.appendChild(li);
    });
  });
}

// Add a new book when the form is submitted
document.getElementById("book-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const status = document.getElementById("status").value;

  if (title === "" || author === "") return;

  books.push({
    id: Date.now(), // good enough for a unique id here
    title: title,
    author: author,
    status: status,
    rating: 0
  });

  save();
  render();
  e.target.reset();
});

function moveBook(id, newStatus) {
  const book = books.find(function (b) { return b.id === id; });
  book.status = newStatus;
  if (newStatus !== "read") book.rating = 0;
  save();
  render();
}

function rateBook(id, stars) {
  const book = books.find(function (b) { return b.id === id; });
  book.rating = book.rating === stars ? 0 : stars; // click same star to clear it
  save();
  render();
}

function deleteBook(id) {
  books = books.filter(function (b) { return b.id !== id; });
  save();
  render();
}

render();

/* Note for Project 02: this is where I'll add a fetch() call to the
   Google Books API to pull in the cover and page count automatically
   instead of typing everything by hand. */
