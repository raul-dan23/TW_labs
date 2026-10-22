const questions = [
    {
        question: "Te-ai apucat de ideea de proiect?",
        options: {
            a: "Da, am început deja",
            b: "Nu, încă nu",
            c: "Mă gândesc la ea"
        },
        correctAnswer: "a",
        correctResponse: "Felicitări! Continuă tot așa!",
        incorrectResponse: "Ar fi bine să te apuci cât mai curând, timpul trece repede!"
    },
    {
        question: "Cum merge echipa ta la proiect?",
        options: {
            a: "Foarte bine, comunicăm des",
            b: "Avem câteva probleme",
            c: "Lucrez singur"
        },
        correctAnswer: "a",
        correctResponse: "Excelent! Comunicarea e cheia unui proiect reușit.",
        incorrectResponse: "Încearcă să organizați întâlniri regulate și să împărțiți clar sarcinile."
    },
    {
        question: "Ce tag HTML folosești pentru cel mai important titlu al paginii?",
        options: {
            a: "<title>",
            b: "<h1>",
            c: "<header>"
        },
        correctAnswer: "b",
        correctResponse: "Corect! <h1> este titlul principal al conținutului.",
        incorrectResponse: "Nu chiar. Titlul principal al conținutului se pune în <h1>."
    },
    {
        question: "Ce proprietate CSS face ca width să includă padding-ul și border-ul?",
        options: {
            a: "display: flex",
            b: "position: relative",
            c: "box-sizing: border-box"
        },
        correctAnswer: "c",
        correctResponse: "Corect! Cu border-box, lățimea include padding-ul și border-ul.",
        incorrectResponse: "Greșit. Răspunsul corect este box-sizing: border-box."
    },
    {
        question: "Ce face e.preventDefault() în handler-ul de submit de la laboratorul de TW?",
        options: {
            a: "Oprește trimiterea formularului și reîncărcarea paginii",
            b: "Șterge datele din formular",
            c: "Validează automat câmpurile"
        },
        correctAnswer: "a",
        correctResponse: "Exact! Așa putem valida datele în JavaScript înainte de trimitere.",
        incorrectResponse: "Nu. preventDefault() oprește comportamentul implicit: trimiterea formularului."
    }
];

let currentQuestionIndex = 0;
let waitingForNext = false;

const chatContainer = document.getElementById("chat-container");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// creeaza o bula de mesaj; textul e inserat ca text, nu ca HTML
function createMessage(sender, text) {
    const message = document.createElement("div");
    message.classList.add("message", sender);

    const label = document.createElement("span");
    label.classList.add("message-label");
    label.textContent = sender === "user" ? "Tu:" : "Bot:";

    message.appendChild(label);
    message.appendChild(document.createTextNode(text));
    chatContainer.appendChild(message);
    return message;
}

function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    const message = createMessage("bot", currentQuestion.question);

    const list = document.createElement("ul");
    list.classList.add("options");

    for (const key in currentQuestion.options) {
        const item = document.createElement("li");
        const letter = document.createElement("strong");
        letter.textContent = key + ") ";
        item.appendChild(letter);
        item.appendChild(document.createTextNode(currentQuestion.options[key]));
        list.appendChild(item);
    }

    message.appendChild(list);
    scrollChatContainerToBottom();
}

function scrollChatContainerToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

chatForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const userAnswer = userInput.value.trim();
    if (userAnswer === "" || waitingForNext) {
        return;
    }

    createMessage("user", userAnswer);
    userInput.value = "";

    // accepta "a", "A", "a)", "a."
    const match = userAnswer.toLowerCase().match(/^([abc])[).]?$/);
    if (!match) {
        createMessage("bot", "Te rog să răspunzi cu a, b sau c.");
        scrollChatContainerToBottom();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (match[1] === currentQuestion.correctAnswer) {
        createMessage("bot", currentQuestion.correctResponse);
    } else {
        createMessage("bot", currentQuestion.incorrectResponse);
    }
    scrollChatContainerToBottom();

    waitingForNext = true;
    setTimeout(function () {
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        displayQuestion();
        waitingForNext = false;
    }, 800);
});

displayQuestion();
