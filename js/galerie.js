"use strict";
// caruselul de imagini din galerie.html
const images = [
    "../media/g1.jpeg",
    "../media/g2.jpeg",
    "../media/g3.jpeg",
    "../media/g4.jpeg"
];
const mainImage = document.getElementById("carousel-image");
if (!mainImage) {
    throw new Error("Elementul #carousel-image nu există în pagină.");
}
let currentIndex = 0;
function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    // cu noUncheckedIndexedAccess, images[i] are tipul string | undefined;
    // "!" spune compilatorului ca indexul e mereu valid (modulo lungimea)
    mainImage.src = images[currentIndex];
}
let carouselTimer = window.setInterval(showNextImage, 3000);
// pauza cat timp mouse-ul e peste imagine
mainImage.addEventListener("mouseenter", () => {
    window.clearInterval(carouselTimer);
    carouselTimer = undefined;
});
mainImage.addEventListener("mouseleave", () => {
    if (carouselTimer === undefined) {
        carouselTimer = window.setInterval(showNextImage, 3000);
    }
});
