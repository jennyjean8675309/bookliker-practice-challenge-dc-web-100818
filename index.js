document.addEventListener("DOMContentLoaded", function() {
  fetchBooks().then(data => renderBooks(data));
});

// functions to grab elements

function getBookList(){
  return document.querySelector('#list');
}

function getShowPanel(){
  return document.querySelector('#show-panel');
}
function fetchBooks(){
  return fetch('http://localhost:3000/books')
    .then(response => response.json())
}

let likeButtonText = true;

function renderBooks(data){
  let list = getBookList();
  data.forEach(book => {
    bookItem = document.createElement('li');
    bookItem.id = `book-${book.id}`;
    bookItem.innerText = `${book.title}`;
    bookItem.addEventListener('click', (event) => {
      getBook(event, book)});
    list.appendChild(bookItem);
  })
}

function getBook(event, book){
  showPanel = getShowPanel();
  showPanel.innerHTML = "";
  usersHeader = document.createElement('h4');
  usersHeader.innerText = 'Users:'
  bookImage = document.createElement('img');
  bookImage.src = book.img_url;
  bookDesc = document.createElement('p');
  bookDesc.innerText = book.description;
  bookUsers = document.createElement('ul');
  book.users.forEach(user => {
    userItem = document.createElement('li');
    userItem.innerText = user.username;
    bookUsers.appendChild(userItem);
  })
  likeButton = document.createElement('button');
  likeButton.addEventListener('click', (event) => { likeOrDislikeBook(event, book)
  likeButtonText = !likeButtonText;
  });
  if (likeButtonText === true){
    likeButton.innerText = 'Like this Book!';
  } else if (likeButtonText === false){
    likeButton.innerText = 'Dislike';
  }
  showPanel.append(bookImage, bookDesc, usersHeader, bookUsers, likeButton);
}

function likeOrDislikeBook(event, book){
  bookId = Number(book.id);
  newUser = {"id": 1, "username": "pouros"}
  if (likeButtonText === true){
  book.users.push(newUser);
  data = {
    "users": book.users
  }} else if (likeButtonText === false){
    book.users.splice(-1);
    data = {
      "users": book.users
    }
  }
  fetch(`http://localhost:3000/books/${bookId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      getBook(event, data);
    })
}
