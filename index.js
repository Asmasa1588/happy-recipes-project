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
};

document.addEventListener("DOMContentLoaded", init);
