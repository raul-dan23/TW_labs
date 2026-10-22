const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // prenume.nume, optional 2 cifre, apoi @e-uvt.ro (cratima permisa in prenume/nume)
    const emailRegex = /^[a-z]+(-[a-z]+)*\.[a-z]+(-[a-z]+)*(\d{2})?@e-uvt\.ro$/i;
    // minim 7 caractere: litera mica, litera mare, cifra si caracter special
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/;

    if (!emailRegex.test(email)) {
        alert("Email invalid! Folosește adresa de student în formatul prenume.nume@e-uvt.ro, opțional urmată de 2 cifre (ex: ion.popescu05@e-uvt.ro).");
        return;
    }

    if (!passwordRegex.test(password)) {
        alert("Parolă invalidă! Parola trebuie să aibă cel puțin 7 caractere și să conțină o literă mică, o literă mare, o cifră și un caracter special.");
        return;
    }

    alert("Login reușit!");
    window.location.href = "home.html";
});
