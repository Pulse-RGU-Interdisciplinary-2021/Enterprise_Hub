let modal = document.querySelector(".modal");
let show = document.querySelector(".show");
let navigation = document.querySelector(".navigate");
let closeButton = document.querySelector(".close-button");
function toggleModal() {
  modal.classList.toggle("show-modal");
}
function windowOnClick(event) {
  console.log(event.target);
  if (event.target === modal) {
    toggleModal();
  }
}
function navigate() {
  window.location.href = "/type";
}
if (show) {
  show.addEventListener("click", toggleModal);
  closeButton.addEventListener("click", toggleModal);
  
}
if (navigation) {
  navigation.addEventListener("click", navigate);
}
window.addEventListener("click", windowOnClick);