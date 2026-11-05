// cercul colorat care urmareste mouse-ul
const cursor: HTMLDivElement = document.createElement("div");
cursor.id = "cursor";
document.body.appendChild(cursor);

document.addEventListener("mousemove", (e: MouseEvent): void => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    // cercul e ascuns pana la prima miscare a mouse-ului
    cursor.classList.add("visible");
});

// ascuns cand mouse-ul iese din fereastra
document.documentElement.addEventListener("mouseleave", (): void => {
    cursor.classList.remove("visible");
});

let hue = 0;

function animateColor(): void {
    hue = (hue + 1) % 360;
    cursor.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
    cursor.style.boxShadow = `0 0 12px 4px hsl(${hue}, 100%, 50%)`;
    requestAnimationFrame(animateColor);
}

animateColor();
