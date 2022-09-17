// Get Element From HTML
let elBookForm = document.querySelector(".book__form");
let elSearcheInput = document.querySelector(".search__input");
let elBookWrapper = document.querySelector(".book__wrapper");
let elBookTemplate = document.querySelector("#book__template").content;
let elBookResult = document.querySelector(".book__result");
let elOrderBtn = document.querySelector(".order__newest");
let elBookImg = document.querySelector(".book__img");
let elSvg = document.querySelector(".svg__change-color"); 
let elBookName = document.querySelector(".book__name");
let elBookAuth = document.querySelector(".book__auth");
let elBookYear = document.querySelector(".book__year");
let elBookBookmark = document.querySelector(".book_bookmark");
let elBookInfo = document.querySelector(".book__info");
let elBookRead = document.querySelector(".book__read");

// Bookmark Element From HTML

let elBookmarkWrapper = document.querySelector(".bookmark__wrapper");
let elBookmarkTemplate = document.querySelector("#bookmark__template").content;

// More Info Element From HTML

let elMoreInfoTemplate = document.querySelector("#more-info__template").content;
let elMoreInfoWrapper = document.querySelector(".more-info__wrapper");


// localStorage

let localStorageBookmark = JSON.parse(localStorage.getItem("book"));
let bookmarkedBook = localStorageBookmark ? localStorageBookmark : [];

renderBookmark(bookmarkedBook);

// addEventListener DOM Method's

elBookForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  
  let inputValue = elSearcheInput.value.trim();
  
  fetch(`https://books.googleapis.com/books/v1/volumes?q=${inputValue}`)
  
  .then(response => response.json())
  .then(data => {
    
    bookRender(data.items, elBookWrapper);
    
    elSearcheInput.value = null;
  });
  
  elOrderBtn.addEventListener("click", function() {
    
    fetch(`https://books.googleapis.com/books/v1/volumes?q=${inputValue}&orderBy=newest`)
    
    .then(response => response.json())
    .then(data => {
      
      bookRender(data.items, elBookWrapper);
      
      elSearcheInput.value = null;
    });
    
  });
  
});


elBookWrapper.addEventListener("click", (event) => {
  let bookmarkedId = event.target.dataset.bookmarkId;
  let moreInformationId = event.target.dataset.moreInfoId;
  
  
  if (moreInformationId) {
    fetch(`https://www.googleapis.com/books/v1/volumes/${moreInformationId}`)
    .then((res) => res.json())
    .then((data) => {
      renderMoreInfo(data, elMoreInfoWrapper);
    });
  }
  
  if (bookmarkedId) {
    if (bookmarkedBook.length == 0) {
      
      fetch(`https://www.googleapis.com/books/v1/volumes/${bookmarkedId}`)
      .then(response => response.json())
      
      .then(data => {
        bookmarkedBook.push(data);
        
        renderBookmark(bookmarkedBook);
        
        localStorage.setItem("book", JSON.stringify(bookmarkedBook));
        
      });
      
    } else if (!bookmarkedBook.find(item => item.id == bookmarkedId)) {
      
      fetch(`https://www.googleapis.com/books/v1/volumes/${bookmarkedId}`)
      .then(res => res.json())
      .then(data => {
        
        bookmarkedBook.push(data);
        
        renderBookmark(bookmarkedBook);
        
        localStorage.setItem("book", JSON.stringify(bookmarkedBook));
      })
    }
    renderBookmark(bookmarkedBook);
  }
});


elBookmarkWrapper.addEventListener("click", function (evt) {
  let foundBookmarkd = evt.target.closest(".bookmark__delete-btn").dataset.bookmarkId;
  
  if (foundBookmarkd) {
    let bookmarkFindId = bookmarkedBook.findIndex(function (item) {
      return item.id == foundBookmarkd;
    })
    
    bookmarkedBook.splice(bookmarkFindId, 1);
    
    localStorage.setItem("book", JSON.stringify(bookmarkedBook));
  }
  
  renderBookmark(bookmarkedBook);
  
});

// Render Books
function bookRender(array, wrapper) {
  wrapper.innerHTML = null;
  
  elBookResult.textContent = array.length;
  
  let fragment = document.createDocumentFragment();
  
  for (const item of array) {
    let bookTemp = elBookTemplate.cloneNode(true);
    
    bookTemp.querySelector(".book__img").src = item.volumeInfo.imageLinks.thumbnail;
    bookTemp.querySelector(".book__name").textContent = item.volumeInfo.title;
    bookTemp.querySelector(".book__auth").textContent = item.volumeInfo.authors;
    bookTemp.querySelector(".book__year").textContent = item.volumeInfo.publishedDate;
    bookTemp.querySelector(".book_bookmark").dataset.bookmarkId = item.id;
    bookTemp.querySelector(".book__info").dataset.moreInfoId = item.id;
    bookTemp.querySelector(".book__read").href = item.volumeInfo.previewLink;
    bookTemp.querySelector(".book__read").target = "_blank";
    
    fragment.appendChild(bookTemp);
  }
  wrapper.appendChild(fragment);
}

// Render Bookmark
function renderBookmark(array) {
  
  elBookmarkWrapper.innerHTML = null;
  let fragment = document.createDocumentFragment();
  
  for (const item of array) {
    let bookmarkTemp = elBookmarkTemplate.cloneNode(true);
    
    bookmarkTemp.querySelector(".bookmark__title").textContent = item.volumeInfo.title;
    bookmarkTemp.querySelector(".bookmark__auth").textContent = item.volumeInfo.authors;
    bookmarkTemp.querySelector(".bookmark__read-link").href = item.accessInfo.webReaderLink;
    bookmarkTemp.querySelector(".bookmark__delete-btn").dataset.bookmarkId = item.id;
    
    fragment.appendChild(bookmarkTemp);
  }
  
  elBookmarkWrapper.appendChild(fragment);
}

// Render More Info
function renderMoreInfo(array, wrapper) {
  wrapper.innerHTML = null;
  
  let fragment = document.createDocumentFragment();
  
  let moreInfoTemp = elMoreInfoTemplate.cloneNode(true);
  
  moreInfoTemp.querySelector(".more-info__title").textContent = array.volumeInfo.authors;
  moreInfoTemp.querySelector(".more-info__img").src = array.volumeInfo.imageLinks.thumbnail;
  moreInfoTemp.querySelector(".more-info__auth ").textContent = array.volumeInfo.authors;
  moreInfoTemp.querySelector(".more-info__published").textContent = array.volumeInfo.publishedDate;
  moreInfoTemp.querySelector(".more-info__publisher").textContent = array.volumeInfo.publisher;
  moreInfoTemp.querySelector(".more-info__category").textContent = array.volumeInfo.categories;
  moreInfoTemp.querySelector(".more-info__pages").textContent = array.volumeInfo.pageCount;
  moreInfoTemp.querySelector(".more-info-text").textContent = array.volumeInfo.description;
  moreInfoTemp.querySelector(".more-info__read").href = array.volumeInfo.previewLink;
  
  fragment.appendChild(moreInfoTemp);
  
  wrapper.appendChild(fragment);
}

// Dark Mode 

const body = document.body;
const darkModeBtn = document.querySelector("#dark-mode-toggle");
const showingBg = document.querySelector(".showing");

darkModeBtn.addEventListener("click", function() {
  
  if(body.classList == 'darkmode'){
    body.classList.remove('darkmode');
    elBookWrapper.classList.remove('darkmode');
    elSvg.classList.toggle("white");
    showingBg.classList.remove('darkmode');
    
  } else{
    elSvg.classList.add("white");
    elBookWrapper.classList.add('darkmode');
    showingBg.classList.add('darkmode');
    body.classList.add('darkmode');
  }
  
});