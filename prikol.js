const input = document.getElementById("search-input");
const finding = document.getElementById("finding");
const searchList = document.getElementById("search-list");
let timeout;
let selectedRepos = [];

input.addEventListener("input", () => {
  clearTimeout(timeout);
  const query = input.value.trim();

  if (query === "") {
    finding.innerHTML = "";
    return;
  }

  timeout = setTimeout(() => {
    fetch(
      `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`
    )
      .then((response) => response.json())
      .then((data) => {
        Searching(data.items);
      });
  }, 500);
});

function Searching(repos) {
  finding.innerHTML = "";

  const availableRepos = repos.filter(
    (repo) => !selectedRepos.includes(repo.name)
  );
  let cutRepos = availableRepos.slice(0, 5);

  cutRepos.forEach((repo) => {
    const li = document.createElement("li");
    li.textContent = repo.name;
    li.onclick = () => addRepo(repo);
    finding.appendChild(li);
  });
}

document.addEventListener("click", (event) => {
  const isClickInside =
    finding.contains(event.target) || input.contains(event.target);
  if (!isClickInside) {
    finding.innerHTML = ""; // Скрываем список результатов
    input.value = ""; // Сбрасываем введенные данные
  }
});

function addRepo(repo) {
  console.log(repo);
  const li = document.createElement("li");
  li.className = "search-item";
  li.innerHTML = ` Name: ${repo.name} <br> Owner: (${repo.owner.login}) <br> Stars: ${repo.stargazers_count} 
        <button class="delete-btn" onclick="deleteRepo(this)"></button>`;
  searchList.appendChild(li);

  selectedRepos.push(repo.name);

  input.value = "";
  finding.innerHTML = "";
}

function deleteRepo(button) {
  const deleteItem = button.parentElement;
  searchList.removeChild(deleteItem);

  const repoName = deleteItem.innerText.split(" ")[1];
  selectedRepos = selectedRepos.filter((name) => name !== repoName);
}
