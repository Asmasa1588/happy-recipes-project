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
      // console.log(editUrl)
      const liElement = document.createElement("li");
      liElement.innerHTML = recipe.title;
      liElement.classList.add("recipe-item");
      liElement.addEventListener("click", () => {
        editRecipesContainer.style.display = "none";
        const imageToDisplayElement =
          document.getElementById("image-to-display");
        editTitle.value = recipe.title;
        editContent.value = recipe.content;
        editUrl.value = recipe.img;
        imageToDisplayElement.setAttribute("src", recipe.img);
        currentlyViewedRecipeId = recipe.id;

        //this is for view

        const viewRecipeContainer = document.getElementById("view-recipe");
        viewRecipeContainer.style.display = "flex";
        viewRecipeContainer.innerHTML = "";
        const titleToShow = document.createElement("h2");
        titleToShow.innerHTML = recipe.title;
        const contentToShow = document.createElement("p");
        contentToShow.innerHTML = recipe.content;
        const imageToShow = document.createElement("img");
        imageToShow.setAttribute("src", recipe.img);
        imageToShow.setAttribute("height", "150px");
        imageToShow.setAttribute("width", "150px");
        const editRecipeButton = document.createElement("button");
        editRecipeButton.innerHTML = "Edit this Recipe";
        editRecipeButton.classList.add("edit-recipe-button");
        editRecipeButton.style.marginLeft = "50px";
        editRecipeButton.addEventListener("click", () => {
          viewRecipeContainer.style.display = "none";
          editRecipesContainer.style.display = "block";
        });
        const rectangleBoxElement = document.createElement("div");
        rectangleBoxElement.classList.add("rectangle-box");
        rectangleBoxElement.classList.add("view-rectangle-box");

        const commentSection = document.createElement("div");

        commentSection.classList.add("comment-section");
        const createCommentForm = document.createElement("form");
        const authorLabel = document.createElement("label");
        authorLabel.innerHTML = "author";
        const authorInput = document.createElement("input");
        const commentLabel = document.createElement("label");
        commentLabel.innerHTML = "Your comment ";
        const brTag = document.createElement("br");
        const brTag2 = document.createElement("br");
        const commentInput = document.createElement("textarea");
        commentInput.setAttribute("rows", "3");
        const submitCommentButton = document.createElement("input");
        submitCommentButton.setAttribute("type", "submit");
        submitCommentButton.setAttribute("value", "submit comments");

        createCommentForm.addEventListener("submit", (commentSubmitEvent) => {
          commentSubmitEvent.preventDefault();
          const author = commentSubmitEvent.path[0][0].value;
          const commentContent = commentSubmitEvent.path[0][1].value;

          fetch(`http://localhost:3000/recipes/${currentlyViewedRecipeId}`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((recipe) => {
              const dataToSend = {
                ...recipe,
                comments: [
                  ...(recipe.comments || []),
                  {
                    author,
                    commentContent,
                  },
                ],
              };
              console.log({
                commentSubmitEvent,
                author,
                commentContent,
                currentlyViewedRecipeId,
                dataToSend,
              });
              fetch(
                `http://localhost:3000/recipes/${currentlyViewedRecipeId}`,
                {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  method: "PUT",
                  body: JSON.stringify(dataToSend),
                }
              )
                .then((res) => res.json())
                .then(() => {
                  fetchBySearchTerm();
                });
            });
        });
        createCommentForm.appendChild(authorLabel);
        createCommentForm.appendChild(authorInput);
        createCommentForm.appendChild(brTag);
        createCommentForm.appendChild(commentLabel);
        createCommentForm.appendChild(commentInput);
        createCommentForm.appendChild(brTag2);
        createCommentForm.appendChild(submitCommentButton);
        commentSection.appendChild(createCommentForm);

        rectangleBoxElement.appendChild(titleToShow);
        rectangleBoxElement.appendChild(contentToShow);
        rectangleBoxElement.appendChild(imageToShow);
        rectangleBoxElement.style.width = "220px";
        const rectangleBoxWrapper = document.createElement("div");
        rectangleBoxWrapper.appendChild(rectangleBoxElement);
        rectangleBoxWrapper.appendChild(editRecipeButton);

        viewRecipeContainer.appendChild(rectangleBoxWrapper);

        viewRecipeContainer.appendChild(commentSection);
      });

      recipesContainer.appendChild(liElement);
    }
  };
  const fetchBySearchTerm = (searchTerm) => {
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
  fetchBySearchTerm();
  const recipeFilterInput = document.getElementById("recipe-filter");
  recipeFilterInput.addEventListener("change", (event) => {
    fetchBySearchTerm(event.target.value);
  });
  const recipeFilterButton = document.getElementById("recipe-filter-button");
  recipeFilterButton.addEventListener("click", () => {
    fetchBySearchTerm(recipeFilterInput.value);
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
        fetchBySearchTerm();
      });
  };
  const createDrinkForm = document.getElementById("create-recipe-form");
  const editDrinkForm = document.getElementById("edit-recipe-form");

  createDrinkForm.addEventListener("submit", handleRecipeCreation);
  editDrinkForm.addEventListener("submit", handleRecipeEdit);
};

document.addEventListener("DOMContentLoaded", init);
