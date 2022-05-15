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
  const editRecipesContainer = document.getElementById("edit-recipe");

  const editTitle = document.getElementById("show-recipe-title-input");
  const editContent = document.getElementById("show-recipe-content-input");
  const editUrl = document.getElementById("show-recipe-image-input");
  let currentlyViewedRecipeId = undefined;

  const renderRecipe = (recipe, filterText) => {
    const shouldRenderRecipe =
      (filterText && recipe.title.includes(filterText)) || !filterText;
    if (shouldRenderRecipe) {
      const liElement = document.createElement("li");
      liElement.innerHTML = recipe.title;
      liElement.classList.add("recipe-item");
      liElement.addEventListener("click", () => {
        editRecipesContainer.style.display = "block";
        const imageToDisplayElement =
          document.getElementById("image-to-display");
        editTitle.value = recipe.title;
        editContent.value = recipe.content;
        editUrl.value = recipe.img;
        imageToDisplayElement.setAttribute("src", recipe.img);
        currentlyViewedRecipeId = recipe.id;
      });

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
    fetchBy(event.target.value);
  });
  const handleRecipeCreation = (event) => {
    event.preventDefault();
    const title = document.getElementById("recipe-title-input");
    const content = document.getElementById("recipe-content-input");
    const image = document.getElementById("recipe-image-input");

    const dataToSend = {
      title: title.value,
      content: content.value,
      img: image.value,
    };
    fetch("http://localhost:3000/recipes", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(dataToSend),
    })
      .then((res) => res.json())
      .then((createdRecipe) => {
        renderRecipe(createdRecipe);
        title.value = "";
        content.value = "";
        image.value = "";
      });
  };

  const handleRecipeEdit = (event) => {
    event.preventDefault();
    console.log(editTitle.value);

    const dataToSend = {
      title: editTitle.value,
      content: editContent.value,
      img: editUrl.value,
    };
    fetch(`http://localhost:3000/recipes/${currentlyViewedRecipeId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(dataToSend),
    })
      .then((res) => res.json())
      .then(() => {
        fetchBy();
      });
  };
  const createDrinkForm = document.getElementById("create-recipe-form");
  const editDrinkForm = document.getElementById("edit-recipe-form");

  createDrinkForm.addEventListener("submit", handleRecipeCreation);
  editDrinkForm.addEventListener("submit", handleRecipeEdit);
};

document.addEventListener("DOMContentLoaded", init);
