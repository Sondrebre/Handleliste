const form = document.querySelector("form");
const input = document.querySelector("input[type='text']");
const list = document.querySelector("ul");
const status = document.querySelector("#status");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = input.value.trim();
    if (text === "") return;

    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const span = document.createElement("span");
    span.textContent = text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Slett";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", function () {
        li.remove();
        checkIfDone();
    });

    checkbox.addEventListener("change", checkIfDone);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);
    list.appendChild(li);

    input.value = "";
});

function checkIfDone() {
    const checkboxes = list.querySelectorAll("input[type='checkbox']");

    if (checkboxes.length === 0) {
        status.style.display = "none";
        return;
    }

    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    status.style.display = allChecked ? "block" : "none";
}
