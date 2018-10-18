document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderDogBar();
});

function fetchAndRenderDogBar() {
  fetch("http://localhost:3000/pups")
    .then(resp => resp.json())
    .then(renderDogs);
}

function renderDogs(dogs) {
  let dogBar = document.getElementById("dog-bar");
  dogBar.innerHTML = "";
  dogs.forEach(dog => {
    dogBar.innerHTML += `<span class="dogbar" data-id ="${dog.id}">${
      dog.name
    }</span>`;
  });
}

document.addEventListener("click", () => {
  if (event.target.className === "dogbar") {
    renderDogInfo(event.target.dataset.id);
  }
  if (event.target.className === "goodDog") {
    toggleDog(event.target.dataset.id, true);
  }
  if (event.target.className === "badDog") {
    toggleDog(event.target.dataset.id, false);
  }
  if (event.target.id === "good-dog-filter") {
    toggleFilter();
    if (flag) event.target.innerText = "Filter good dogs: OFF";
    else event.target.innerText = "Filter good dogs: ON";
  }
});

let flag = false;

function toggleFilter() {
  fetch("http://localhost:3000/pups")
    .then(resp => resp.json())
    .then(dogs => {
      flag = !flag;
      let filterDogs = dogs.filter(dog => dog.isGoodDog);
      if (flag) {
        renderDogs(filterDogs);
        console;
      } else {
        renderDogs(dogs);
      }
    });
}

function toggleDog(id, goodOrBad) {
  fetch(`http://localhost:3000/pups/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      isGoodDog: !goodOrBad
    })
  });
  changeButton(id);
}

function changeButton(id) {
  let goodDogButton = document.querySelector(".goodDog");
  let badDogButton = document.querySelector(".badDog");

  if (goodDogButton) {
    goodDogButton.classList.value = "badDog";
    goodDogButton.innerText = "Bad Dog!";
  } else {
    badDogButton.classList.value = "goodDog";
    badDogButton.innerText = "Good Dog!";
  }
}

function renderDogInfo(id) {
  let dogInfoContainer = document.getElementById("dog-info");
  fetch(`http://localhost:3000/pups/${id}`)
    .then(resp => resp.json())
    .then(dog => {
      dogInfoContainer.innerHTML = `
    <img src=${dog.image}> 
    <h2>${dog.name}</h2>`;
      if (dog.isGoodDog)
        dogInfoContainer.innerHTML += `<button class="goodDog" data-id="${
          dog.id
        }">Good Dog!</button>`;
      else
        dogInfoContainer.innerHTML += `<button class="badDog" data-id="${
          dog.id
        }">Bad Dog!</button>`;
    });
}
