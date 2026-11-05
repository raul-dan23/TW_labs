// caruselul de imagini din galerie.html
const images: string[] = [
    "../media/g1.jpeg",
    "../media/g2.jpeg",
    "../media/g3.jpeg",
    "../media/g4.jpeg"
];

// textul alternativ al fiecarei imagini, in aceeasi ordine
const imageAlts: string[] = [
    "Festivitate în aer liber a Universității de Vest din Timișoara, cu o scenă și sute de participanți într-o piață din centrul orașului",
    "Clădirea Universității de Vest din Timișoara și sigla universității, pe un panou sprijinit pe cărți cu numele facultăților",
    "Vedere aeriană de toamnă asupra clădirilor Universității de Vest din Timișoara",
    "Studenți și profesori ascultând atenți într-un amfiteatru"
];

const mainImage = document.getElementById("carousel-image") as HTMLImageElement;
if (!mainImage) {
    throw new Error("Elementul #carousel-image nu există în pagină.");
}

let currentIndex = 0;

function showNextImage(): void {
    currentIndex = (currentIndex + 1) % images.length;
    // cu noUncheckedIndexedAccess, images[i] are tipul string | undefined;
    // "!" spune compilatorului ca indexul e mereu valid (modulo lungimea)
    mainImage.src = images[currentIndex]!;
    mainImage.alt = imageAlts[currentIndex] ?? "";
}

let carouselTimer: number | undefined = window.setInterval(showNextImage, 3000);

// pauza cat timp mouse-ul e peste imagine
mainImage.addEventListener("mouseenter", (): void => {
    window.clearInterval(carouselTimer);
    carouselTimer = undefined;
});

mainImage.addEventListener("mouseleave", (): void => {
    if (carouselTimer === undefined) {
        carouselTimer = window.setInterval(showNextImage, 3000);
    }
});
