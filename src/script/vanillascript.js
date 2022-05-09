// Remove the black cover from front screen
const blackScreen = document.querySelector(".black-cover");
setTimeout(() => {
  blackScreen.style.opacity = "0%";
}, 1000);
setTimeout(() => {
  blackScreen.style.display = "none";
}, 2000);
