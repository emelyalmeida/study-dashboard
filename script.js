const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        const target = button.dataset.section;

        navButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        pages.forEach(page =>
            page.classList.remove("active-page")
        );

        document
            .getElementById(target)
            .classList.add("active-page");
    });
});


// pomodoro
let tempo = 25 * 60;
let pomodoroInterval = null;
let rodando = false;
let ciclo = 1;
let modo = "foco";

function atualizarTimer() {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;

    const tempoFormatado =
        `${minutos}:${segundos < 10 ? "0" : ""}${segundos}`;

    document.getElementById("timer").textContent =
        tempoFormatado;

    document.getElementById("fullPomodoroTimer").textContent =
        tempoFormatado;

    document.getElementById("pomodoroCycle").textContent =
        `Ciclo: ${ciclo}`;

    const status =
        document.getElementById("pomodoroStatus");

    if (modo === "foco") status.textContent = "Foco";
    if (modo === "pausa-curta") status.textContent = "Pausa curta";
    if (modo === "pausa-longa") status.textContent = "Pausa longa";
}

function startPomodoro() {
    if (rodando) return;

    rodando = true;

    pomodoroInterval = setInterval(() => {
        tempo--;

        atualizarTimer();

        if (tempo < 0) {
            clearInterval(pomodoroInterval);
            rodando = false;
            proximoCiclo();
        }

    }, 1000);
}

function pausePomodoro() {
    clearInterval(pomodoroInterval);
    rodando = false;
}

function resetPomodoro() {
    clearInterval(pomodoroInterval);

    tempo = 25 * 60;
    ciclo = 1;
    modo = "foco";
    rodando = false;

    atualizarTimer();
}

function proximoCiclo() {
    if (modo === "foco") {

        if (ciclo % 4 === 0) {
            modo = "pausa-longa";
            tempo = 15 * 60;
            alert("Pausa longa ✨");
        } else {
            modo = "pausa-curta";
            tempo = 5 * 60;
            alert("Pausa curta 🌸");
        }

    } else {
        modo = "foco";
        ciclo++;
        tempo = 25 * 60;
        alert("Novo foco 💻");
    }

    atualizarTimer();
}


// criar item
function criarItem(texto, listaId, storageKey, concluido = false) {
    const lista = document.getElementById(listaId);

    const li = document.createElement("li");
    li.setAttribute("draggable", true);

    const span = document.createElement("span");
    span.textContent = texto;

    if (concluido) {
        span.style.textDecoration = "line-through";
        span.style.opacity = "0.6";
    }

    span.addEventListener("click", () => {
        const feito =
            span.style.textDecoration === "line-through";

        span.style.textDecoration =
            feito ? "none" : "line-through";

        span.style.opacity =
            feito ? "1" : "0.6";

        salvarLista(listaId, storageKey);
        sincronizarPaginas();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "✕";

    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "7px 10px";
    deleteBtn.style.borderRadius = "12px";
    deleteBtn.style.cursor = "pointer";

    deleteBtn.addEventListener("click", () => {
        li.remove();
        salvarLista(listaId, storageKey);
        sincronizarPaginas();
    });

    li.addEventListener("dragstart", () => {
        li.classList.add("dragging");
    });

    li.addEventListener("dragend", () => {
        li.classList.remove("dragging");
        salvarLista(listaId, storageKey);
        sincronizarPaginas();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);

    lista.appendChild(li);
}


// tarefas
function addTask() {
    const input = document.getElementById("taskInput");
    const texto = input.value.trim();

    if (!texto) return;

    criarItem(texto, "taskList", "emelyTasks");

    input.value = "";

    salvarLista("taskList", "emelyTasks");
    sincronizarPaginas();
}

function addTaskFromPage() {
    const input =
        document.getElementById("taskInputPage");

    const texto = input.value.trim();

    if (!texto) return;

    criarItem(texto, "taskList", "emelyTasks");

    input.value = "";

    salvarLista("taskList", "emelyTasks");
    sincronizarPaginas();
}


// metas
function addGoal() {
    const input =
        document.getElementById("goalInput");

    const texto = input.value.trim();

    if (!texto) return;

    criarItem(texto, "goalsList", "emelyGoals");

    input.value = "";

    salvarLista("goalsList", "emelyGoals");
    sincronizarPaginas();
}

function addGoalFromPage() {
    const input =
        document.getElementById("goalInputPage");

    const texto = input.value.trim();

    if (!texto) return;

    criarItem(texto, "goalsList", "emelyGoals");

    input.value = "";

    salvarLista("goalsList", "emelyGoals");
    sincronizarPaginas();
}


// salvar listas
function salvarLista(listaId, storageKey) {
    const itens = [];

    document
        .querySelectorAll(`#${listaId} li span`)
        .forEach(item => {
            itens.push({
                texto: item.textContent,
                concluido:
                    item.style.textDecoration ===
                    "line-through"
            });
        });

    localStorage.setItem(
        storageKey,
        JSON.stringify(itens)
    );
}


// carregar listas
function carregarLista(listaId, storageKey) {
    const lista =
        document.getElementById(listaId);

    if (!lista) return;

    lista.innerHTML = "";

    const itens =
        JSON.parse(
            localStorage.getItem(storageKey)
        ) || [];

    itens.forEach(item => {
        criarItem(
            item.texto,
            listaId,
            storageKey,
            item.concluido
        );
    });
}


// sincronizar
function sincronizarPaginas() {

    const taskPage =
        document.getElementById("taskListPage");

    if (taskPage) {
        taskPage.innerHTML = "";

        document
            .querySelectorAll("#taskList li")
            .forEach(item => {
                taskPage.appendChild(
                    item.cloneNode(true)
                );
            });
    }

    const goalPage =
        document.getElementById("goalsListPage");

    if (goalPage) {
        goalPage.innerHTML = "";

        document
            .querySelectorAll("#goalsList li")
            .forEach(item => {
                goalPage.appendChild(
                    item.cloneNode(true)
                );
            });
    }
}


// humor
function setMood(mood, emoji) {
    const hoje = new Date();

    const dataFormatada =
        hoje.toLocaleDateString("pt-BR");

    document.getElementById(
        "moodDisplay"
    ).textContent =
        `Hoje: ${emoji} ${mood}`;

    document.getElementById(
        "moodDate"
    ).textContent =
        `Registrado em ${dataFormatada}`;

    localStorage.setItem(
        "emelyMood",
        JSON.stringify({
            mood,
            emoji,
            data: dataFormatada
        })
    );
}

function carregarMood() {
    const moodData =
        JSON.parse(
            localStorage.getItem("emelyMood")
        );

    if (moodData) {
        document.getElementById(
            "moodDisplay"
        ).textContent =
            `Hoje: ${moodData.emoji} ${moodData.mood}`;

        document.getElementById(
            "moodDate"
        ).textContent =
            `Registrado em ${moodData.data}`;
    }
}


// hábitos
function carregarHabitos() {
    const habits =
        document.querySelectorAll(
            ".habits-card input"
        );

    habits.forEach((habit, index) => {

        habit.checked =
            localStorage.getItem(
                `habito-${index}`
            ) === "true";

        habit.addEventListener(
            "change",
            () => {
                localStorage.setItem(
                    `habito-${index}`,
                    habit.checked
                );
            }
        );

    });
}


// anotações
function saveNotes() {
    const notes =
        document.getElementById("notesPage");

    const status =
        document.getElementById("notesStatus");

    localStorage.setItem(
        "emelyNotas",
        notes.value
    );

    status.textContent =
        "Anotações salvas ✨";
}

function clearNotes() {
    const notes =
        document.getElementById("notesPage");

    const status =
        document.getElementById("notesStatus");

    notes.value = "";

    localStorage.removeItem(
        "emelyNotas"
    );

    status.textContent =
        "Anotações removidas.";
}

function carregarNotas() {
    const notes =
        document.getElementById("notesPage");

    if (!notes) return;

    notes.value =
        localStorage.getItem("emelyNotas")
        || "";
}


// dark mode
function toggleDarkMode() {
    document.body.classList.toggle(
        "dark-mode"
    );

    localStorage.setItem(
        "emelyDark",
        document.body.classList.contains(
            "dark-mode"
        )
    );
}

function carregarDarkMode() {
    if (
        localStorage.getItem("emelyDark")
        === "true"
    ) {
        document.body.classList.add(
            "dark-mode"
        );
    }
}

document
    .getElementById("darkModeToggle")
    ?.addEventListener(
        "click",
        toggleDarkMode
    );


// busca
document
    .getElementById("searchInput")
    ?.addEventListener("input", function () {

        const valor =
            this.value.toLowerCase();

        document
            .querySelectorAll(".dream-card")
            .forEach(card => {

                card.style.display =
                    card.innerText
                        .toLowerCase()
                        .includes(valor)
                        ? "block"
                        : "none";

            });

    });


// frase
const frases = [
    "A constância muda tudo.",
    "Seu futuro começa hoje.",
    "Pequenos passos contam.",
    "Continue.",
    "Disciplina é poder."
];

function carregarFrase() {
    const quote =
        document.querySelector(
            ".quote-text"
        );

    if (!quote) return;

    const dia =
        new Date().getDate();

    quote.textContent =
        `"${frases[dia % frases.length]}"`;
}


// iniciar
window.onload = () => {

    atualizarTimer();

    carregarLista(
        "taskList",
        "emelyTasks"
    );

    carregarLista(
        "goalsList",
        "emelyGoals"
    );

    sincronizarPaginas();

    carregarMood();
    carregarHabitos();
    carregarDarkMode();
    carregarFrase();
    carregarNotas();

};