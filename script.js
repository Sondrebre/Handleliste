const form = document.getElementById("form");
const input = document.getElementById("input");
const list = document.getElementById("list");
const resetBtn = document.getElementById("resetBtn");
const stats = document.getElementById("stats");
const themeToggle = document.getElementById("themeToggle");
const bgPicker = document.getElementById("bgPicker");

let items = JSON.parse(localStorage.getItem("handleliste")) || [];
let dragIndex = null;

function save() {
    localStorage.setItem("handleliste", JSON.stringify(items));
}

function render() {
    list.innerHTML = "";

    items.forEach((item, index) => {
        const li = document.createElement("li");
        li.draggable = true;

        li.addEventListener("dragstart", () => dragIndex = index);
        li.addEventListener("dragover", e => e.preventDefault());
        li.addEventListener("drop", () => reorder(index));

        // VENSTRE SIDE (tekst)
        const left = document.createElement("div");
        left.classList.add("item-left");

        const span = document.createElement("span");
        span.textContent = item.text;

        if (item.completed) {
            span.style.textDecoration = "line-through";
            span.style.opacity = "0.6";
        }

        span.addEventListener("dblclick", () => {
            if (item.completed) return;
            span.contentEditable = true;
            span.focus();
        });

        span.addEventListener("blur", () => {
            span.contentEditable = false;
            items[index].text = span.textContent.trim();
            save();
        });

        left.appendChild(span);

        // HØYRE SIDE (checkbox + slett)
        const right = document.createElement("div");
        right.classList.add("item-right");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.completed;

        checkbox.addEventListener("change", () => {
            items[index].completed = checkbox.checked;
            save();
            render();
        });

        const del = document.createElement("button");
        del.textContent = "X";
        del.onclick = () => remove(index);

        right.appendChild(checkbox);
        right.appendChild(del);

        li.appendChild(left);
        li.appendChild(right);

        list.appendChild(li);
    });

    updateStats();
}

function add(text) {
    items.push({
        id: Date.now(),
        text,
        completed: false
    });
    save();
    render();
}

function remove(index) {
    items.splice(index, 1);
    save();
    render();
}

function reorder(newIndex) {
    const moved = items.splice(dragIndex, 1)[0];
    items.splice(newIndex, 0, moved);
    save();
    render();
}

function updateStats() {
    const total = items.length;
    const done = items.filter(i => i.completed).length;
    stats.textContent = `Totalt: ${total} | Fullført: ${done}`;
}

form.addEventListener("submit", e => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    add(value);
    input.value = "";
});

resetBtn.onclick = () => {
    items = [];
    save();
    render();
};

themeToggle.onclick = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
};

bgPicker.addEventListener("input", e => {
    document.documentElement.style.setProperty("--bg", e.target.value);
    localStorage.setItem("bgColor", e.target.value);
});

function loadPreferences() {
    const dark = localStorage.getItem("darkMode") === "true";
    const bg = localStorage.getItem("bgColor");

    if (dark) document.body.classList.add("dark");
    if (bg) {
        document.documentElement.style.setProperty("--bg", bg);
        bgPicker.value = bg;
    }
}

loadPreferences();
render();
