const track = document.querySelector("#image-track");
const handleOnDown = (e) => (track.dataset.mouseDownAt = e.clientX);

const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
};

const handleOnMove = (e) => {
  if (track.dataset.mouseDownAt === "0") return;

  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
  const maxDelta = window.innerWidth / 2;
  const speedMultiplier = 0.2;

  const percentage = (mouseDelta / maxDelta) * -100 * speedMultiplier;
  const nextPercentageUnconstrained =
    parseFloat(track.dataset.prevPercentage) + percentage;
  const nextPercentage = Math.max(
    Math.min(nextPercentageUnconstrained, 0),
    -100
  );

  track.dataset.percentage = nextPercentage;

  track.style.transform = `translate(${nextPercentage}%, -50%)`;

  for (const image of track.getElementsByClassName("image")) {
    image.style.objectPosition = `${100 + nextPercentage}% center`;
  }
};

// /* touch events */
window.onmousedown = (e) => handleOnDown(e);
window.ontouchstart = (e) => handleOnDown(e.touches[0]);
window.onmouseup = (e) => handleOnUp(e);
window.ontouchend = (e) => handleOnUp(e.touches[0]);
window.onmousemove = (e) => handleOnMove(e);
window.ontouchmove = (e) => handleOnMove(e.touches[0]);

// Image slider
const slider = document.querySelector(".slider");
const btns = document.querySelectorAll(".sliderbtn");
const slides = document.querySelectorAll(".img");
const backgrounds = document.querySelectorAll(".bg");
const options = document.querySelectorAll(".option");

let index = 1;
let op_index = 0;
const size = slides[index].clientWidth;
update();

function update() {
  slider.style.transform = "translateX(" + -size * index + "px)";

  backgrounds.forEach((img) => img.classList.remove("show"));
  backgrounds[op_index].classList.add("show");

  options.forEach((option) => option.classList.remove("colored"));
  options[op_index].classList.add("colored");
}

function slide() {
  slider.style.transition = "transform .5s ease-in-out";
  update();
}

function btnCheck() {
  if (this.id === "prev") {
    index--;
    if (op_index === 0) {
      op_index = 4;
    } else {
      op_index--;
    }
  } else {
    index++;
    if (op_index === 4) {
      op_index = 0;
    } else {
      op_index++;
    }
  }

  slide();
}

function optionFunc() {
  const i = Number(this.getAttribute("op-index"));
  op_index = i;
  index = i + 1;

  slide();
}

slider.addEventListener("transitionend", () => {
  if (slides[index].id === "first") {
    slider.style.transition = "none";
    index = slides.length - 2;
    slider.style.transform = "translateX(" + -size * index + "px)";
  } else if (slides[index].id === "last") {
    slider.style.transition = "none";
    index = 1;
    slider.style.transform = "translateX(" + -size * index + "px)";
  }
});

btns.forEach((sliderbtn) => sliderbtn.addEventListener("click", btnCheck));
options.forEach((option) => option.addEventListener("click", optionFunc));
