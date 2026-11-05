// API-ul merge doar pe HTTP
const API_URL = "http://universities.hipolabs.com/search?country=Romania";
// sursa de rezerva: lista statica a aceluiasi proiect (HTTPS, CORS deschis, toata lumea)
const FALLBACK_URL = "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json";

const statusEl = document.getElementById("status");
const tbody = document.getElementById("tbody");
const qInput = document.getElementById("q");
const exportBtn = document.getElementById("exportBtn");

let allUniversities = [];
let currentData = [];
let dataSource = "";

function setStatus(message) {
    statusEl.textContent = message;
}

// primul URL din web_pages, doar daca e http:// sau https://
function getSite(university) {
    const pages = Array.isArray(university.web_pages) ? university.web_pages : [];
    const url = String(pages[0] ?? "");
    return /^https?:\/\//i.test(url) ? url : "";
}

// randurile sunt construite cu createElement + textContent, fara innerHTML
function render(list) {
    tbody.replaceChildren();

    if (list.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 3;
        td.className = "empty";
        td.textContent = "Niciun rezultat.";
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    for (const university of list) {
        const tr = document.createElement("tr");

        const tdName = document.createElement("td");
        tdName.textContent = String(university.name ?? "");

        const tdCountry = document.createElement("td");
        tdCountry.textContent = String(university.country ?? "");

        const tdSite = document.createElement("td");
        const site = getSite(university);
        if (site) {
            const link = document.createElement("a");
            link.href = site;
            link.textContent = site;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            tdSite.appendChild(link);
        } else {
            tdSite.textContent = "—";
        }

        tr.append(tdName, tdCountry, tdSite);
        tbody.appendChild(tr);
    }
}

async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Răspuns invalid de la server: HTTP " + res.status);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
        throw new Error("Format de date neașteptat");
    }
    return data;
}

function showFiltered() {
    const term = qInput.value.trim().toLowerCase();
    currentData = allUniversities.filter(function (u) {
        return String(u.name ?? "").toLowerCase().includes(term);
    });
    render(currentData);

    if (term) {
        setStatus(currentData.length + " din " + allUniversities.length + " universități (sursa: " + dataSource + ").");
    } else {
        setStatus(allUniversities.length + " universități încărcate din " + dataSource + ".");
    }
}

async function loadUniversities() {
    setStatus("Se încarcă universitățile...");
    let data;

    try {
        // pe HTTPS (ex. GitHub Pages) browserul blocheaza cererea HTTP ca mixed content
        if (location.protocol === "https:") {
            throw new Error("Pagina este pe HTTPS, API-ul HTTP ar fi blocat");
        }
        data = await fetchJSON(API_URL);
        dataSource = "API-ul Hipolabs";
    } catch (err) {
        console.warn("API indisponibil, folosesc lista de rezervă:", err);
        try {
            setStatus("API-ul nu răspunde, se încarcă lista de rezervă de pe GitHub...");
            const world = await fetchJSON(FALLBACK_URL);
            data = world.filter(function (u) {
                return u.country === "Romania";
            });
            dataSource = "lista de rezervă de pe GitHub";
        } catch (fallbackErr) {
            console.error(fallbackErr);
            setStatus("Eroare la încărcarea datelor. Verifică conexiunea și încearcă din nou.");
            return;
        }
    }

    data.sort(function (a, b) {
        return String(a.name ?? "").localeCompare(String(b.name ?? ""), "ro");
    });
    allUniversities = data;
    showFiltered();
}

function exportCSV(data) {
    const header = ["Nume", "Țara", "Site"];
    const rows = data.map(function (u) {
        return [u.name, u.country, getSite(u)];
    });

    const escapeValue = function (value) {
        return '"' + String(value ?? "").replace(/"/g, '""') + '"';
    };

    // BOM la inceput ca Excel sa afiseze corect diacriticele
    const csv = "﻿" + [header, ...rows]
        .map(function (row) {
            return row.map(escapeValue).join(",");
        })
        .join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "universitati_romania.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    // revocarea imediata poate anula descarcarea in unele browsere
    setTimeout(function () {
        URL.revokeObjectURL(url);
    }, 1000);
}

qInput.addEventListener("input", showFiltered);

exportBtn.addEventListener("click", function () {
    if (currentData.length === 0) {
        setStatus("Nu există date de exportat.");
        return;
    }
    exportCSV(currentData);
});

loadUniversities();
