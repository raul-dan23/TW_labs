"use strict";
// cardurile din home.html apar pe rand la incarcarea paginii
const revealCards = document.querySelectorAll(".column");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const REVEAL_STEP_MS = 150;
const REVEAL_DURATION_MS = 600;
// dupa animatie scoatem clasele, ca efectul de hover al cardului sa mearga normal
function finishReveal(card) {
    card.classList.remove("reveal", "reveal-visible");
    card.style.transitionDelay = "";
}
// starea ascunsa se aplica doar aici, deci fara JavaScript cardurile raman vizibile
if (!prefersReducedMotion) {
    revealCards.forEach((card, i) => {
        const delay = i * REVEAL_STEP_MS;
        card.classList.add("reveal");
        card.style.transitionDelay = `${delay}ms`;
        // curatenie dupa ce tranzitia acestui card s-a terminat
        window.setTimeout(() => finishReveal(card), delay + REVEAL_DURATION_MS + 200);
    });
    // doua cadre: browserul deseneaza intai starea ascunsa, apoi porneste tranzitia
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            revealCards.forEach((card) => {
                card.classList.add("reveal-visible");
            });
        });
    });
}
