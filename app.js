const search = document.querySelector(".repositories__input");
const matchList = document.querySelector(".repositories__match");
const choiceList = document.querySelector(".repositories__choice");

matchList.addEventListener("click", function (event) {
  let target = event.target;
  if (!target.classList.contains("repositories__match__item")) return;
  addChosen(target);
  search.value = "";
  matchList.innerHTML = "";
});

choiceList.addEventListener("click", function (event) {
  let target = event.target;
  if (!target.classList.contains("repositories__choice__btn")) return;
  target.parentElement.parentElement.remove();
});

function addChosen(target) {
  let name = target.textContent;
  let owner = target.dataset.owner;
  let stars = target.dataset.stars;

  choiceList.insertAdjacentHTML(
    "beforeend",
    `<li class="repositories__choice__item">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}
    <button class="repositories__choice__btn">
    <img class="repositories__choice__btn" src="./assets/img/close_btn.png" alt="close-btn" /></button></li>`
  );
}

function showMatches(repositories) {
  matchList.innerHTML = "";
  for (let repositoryIndex = 0; repositoryIndex < 5; repositoryIndex++) {
    let name = repositories.items[repositoryIndex].name;
    let owner = repositories.items[repositoryIndex].owner.login;
    let stars = repositories.items[repositoryIndex].stargazers_count;
    matchList.insertAdjacentHTML(
      "beforeend",
      `<li class="repositories__match__item" data-owner="${owner}" data-stars="${stars}">${name}</li>`
    );
  }
}

let getPost = async (inputValue) => {
  if (inputValue.target.value == "") {
    matchList.innerHTML = "";
    return;
  }
  console.log(inputValue.target.value);

  try {
    let response = await fetch(
      `https://api.github.com/search/repositories?q=${inputValue.target.value}in:name&per_page=5`
    );

    if (response.ok) {
      let nameRepo = await response.json();
      showMatches(nameRepo);
      console.log(nameRepo);
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};

const debounce = (fn, debounceTime) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), debounceTime);
  };
};

getPost = debounce(getPost, 1000);
search.addEventListener("keyup", getPost);
