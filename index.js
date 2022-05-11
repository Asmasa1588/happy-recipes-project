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
  const renderRecipe = (recipe, filterText) => {
    const shouldRenderRecipe =
      (filterText && recipe.title.includes(filterText)) || !filterText;
    if (shouldRenderRecipe) {
      const liElement = document.createElement("li");
      liElement.innerHTML = recipe.title;
      recipesContainer.appendChild(liElement);
    }
  };
  const fetchBy = (searchTerm) => {
    fetch("http://localhost:3000/recipes")
      .then((res) => res.json())
      .then((data) => {
        recipesContainer.innerHTML = "";
        data.forEach((recipe) => {
          if (searchTerm) {
            renderRecipe(recipe, searchTerm);
          } else {
            renderRecipe(recipe);
          }
        });
      });
  };
  fetchBy();
  const recipeFilter = document.getElementById("recipe-filter");
  recipeFilter.addEventListener("change", (event) => {
    console.log({ event: event.target.value });
    fetchBy(event.target.value);
  });
};

document.addEventListener("DOMContentLoaded", init);
