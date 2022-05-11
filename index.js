console.log("hello world");
const init = () => {
  const isLegalAge = confirm("Are you 21 years or older?");
  if (isLegalAge) {
    main();
  } else {
    const app = document.getElementById("app");
    app.innerHTML = "We are sorry, but you are not old enough!";
  }
};
const main = () => {
  //The core of the project
  const recipesContainer = document.getElementById("recipes-container");
  fetch("http://localhost:3000/recipes")
    .then((res) => res.json())
    .then((data) => {
      console.log({ data });
      data.forEach((recipe) => {
        const liElement = document.createElement("li");
        liElement.innerHTML = recipe.title;
        recipesContainer.appendChild(liElement);
      });
    });

  document.getElementById("recipe-filter");
};

document.addEventListener("DOMContentLoaded", init);
