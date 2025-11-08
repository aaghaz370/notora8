// ✅ Backend API URL
const API_URL = "https://notoraadminbackend-1.onrender.com/api/books";

// ✅ Category list
const categories = [
  "Fictional", "JEE", "NEET", "Hindi Story Book", "UPSC", "Biography",
  "Romance", "Horror", "Fantasy", "Coding", "Business", "CBSE", "ICSE",
  "10th", "11th", "12th", "Spiritual", "Comics", "Self Help"
];

const categoryContainer = document.getElementById("categoryContainer");

// ✅ Load all books from MongoDB
let allBooks = [];

async function loadAllBooks() {
  try {
    console.log("⏳ Fetching books...");
    const res = await fetch(API_URL, { mode: "cors" });
    if (!res.ok) throw new Error("Failed to fetch");

    allBooks = await res.json();

    console.log("✅ Books fetched:", allBooks.length);

    if (!Array.isArray(allBooks) || allBooks.length === 0) {
      categoryContainer.innerHTML = `<p style="text-align:center;color:#aaa;margin-top:50px;">No books found in database</p>`;
      return;
    }

    // ✅ Render each category
    categories.forEach(loadCategory);
  } catch (err) {
    console.error("❌ Error fetching books:", err);
    categoryContainer.innerHTML = `<p style="text-align:center;color:#f55;margin-top:50px;">Failed to connect to backend.</p>`;
  }
}

// ✅ Render a single category
function loadCategory(category) {
  const books = allBooks.filter(b => {
    const g = (b.genre || "").trim().toLowerCase();
    return g === category.toLowerCase();
  });

  if (books.length === 0) return;

  const limitedBooks = books.slice(0, 30);

  const section = document.createElement("div");
  section.className = "category-section";

  const title = document.createElement("h3");
  title.className = "category-title";
  title.textContent = category.toUpperCase();

  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";

  const slider = document.createElement("div");
  slider.className = "book-slider";

  limitedBooks.forEach(book => {
    const imgSrc = book.thumbnail?.trim() || "https://via.placeholder.com/150x220?text=No+Image";

    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <img src="${imgSrc}" alt="${book.name}" />
      <div class="book-title">${book.name}</div>
      <div class="book-author">${book.author}</div>
    `;
    card.addEventListener("click", () => {
      localStorage.setItem("selectedBook", JSON.stringify(book));
      window.location.href = "book.html";
    });
    slider.appendChild(card);
  });

  // ✅ Add "Show All" card
  const showAllCard = document.createElement("div");
  showAllCard.className = "book-card show-all-card";
  showAllCard.innerHTML = `<span>Show All →</span>`;
  showAllCard.addEventListener("click", () => {
    window.location.href = `category.html?genre=${encodeURIComponent(category)}`;
  });
  slider.appendChild(showAllCard);

  // ✅ Desktop arrows only
  if (window.innerWidth > 768) {
    const leftArrow = document.createElement("button");
    leftArrow.className = "arrow-btn arrow-left";
    leftArrow.innerHTML = "&#8249;";
    leftArrow.onclick = () => slider.scrollBy({ left: -300, behavior: "smooth" });

    const rightArrow = document.createElement("button");
    rightArrow.className = "arrow-btn arrow-right";
    rightArrow.innerHTML = "&#8250;";
    rightArrow.onclick = () => slider.scrollBy({ left: 300, behavior: "smooth" });

    wrapper.appendChild(leftArrow);
    wrapper.appendChild(slider);
    wrapper.appendChild(rightArrow);
  } else {
    wrapper.appendChild(slider);
  }

  section.appendChild(title);
  section.appendChild(wrapper);
  categoryContainer.appendChild(section);
}

// ✅ Search Logic
const openSearch = document.getElementById("openSearch");
const searchOverlay = document.getElementById("searchOverlay");
const closeOverlay = document.getElementById("closeOverlay");
const overlaySearchInput = document.getElementById("overlaySearchInput");
const searchResults = document.getElementById("searchResults");

let searchTimeout = null;

// Loader
const loader = document.createElement("div");
loader.className = "loader";
loader.innerHTML = `<div class="spinner spinner-dots"><div></div><div></div><div></div></div>`;
searchResults.parentElement.appendChild(loader);
loader.style.display = "none";

// Open search overlay
openSearch.addEventListener("click", () => {
  document.getElementById("mainContent").style.display = "none";
  searchOverlay.classList.remove("hidden");
});

// Close overlay
closeOverlay.addEventListener("click", () => {
  searchOverlay.classList.add("hidden");
  document.getElementById("mainContent").style.display = "block";
  overlaySearchInput.value = "";
  searchResults.innerHTML = "";
  loader.style.display = "none";
});

// Debounced search
overlaySearchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  const query = e.target.value.toLowerCase().trim();

  if (query === "") {
    searchResults.innerHTML = "";
    loader.style.display = "none";
    return;
  }

  searchResults.innerHTML = "";
  loader.style.display = "flex";

  searchTimeout = setTimeout(() => performSearch(query), 250);
});

function performSearch(query) {
  if (!allBooks.length) return;

  const filtered = allBooks.filter(book => {
    const name = (book.name || "").toLowerCase();
    const author = (book.author || "").toLowerCase();
    const genre = (book.genre || "").toLowerCase();
    return name.includes(query) || author.includes(query) || genre.includes(query);
  });

  loader.style.display = "none";
  searchResults.innerHTML = "";

  if (filtered.length === 0) {
    const noResult = document.createElement("div");
    noResult.className = "no-result";
    noResult.textContent = "No results found";
    searchResults.appendChild(noResult);
    return;
  }

  filtered.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <img src="${book.thumbnail}" alt="${book.name}" />
      <div class="book-title">${book.name}</div>
      <div class="book-author">${book.author}</div>
    `;
    card.addEventListener("click", () => {
      localStorage.setItem("selectedBook", JSON.stringify(book));
      window.location.href = "book.html";
    });
    searchResults.appendChild(card);
  });
}

// ✅ Run on load
loadAllBooks();


const profileIcon = document.getElementById("profileIcon");
const profileMenu = document.getElementById("profileMenu");

profileIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
});

// Hide menu when clicking outside
document.addEventListener("click", (e) => {
  if (!profileIcon.contains(e.target)) {
    profileMenu.style.display = "none";
  }
});


