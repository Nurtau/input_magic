const input = document.getElementById("input_field");
const slots = document.querySelector(".slots");

input.addEventListener("input", addItems);

function addItems(event) {
    event.preventDefault();
    let number = parseInt(input.value);
    if (!(isNaN(number))) {
        while (slots.firstChild) {
            slots.removeChild(slots.firstChild);
        };
        for (let i = 1; i <= number; i++) {
            let html = `
            <div class="item">
                <h1>${i}</h1>
            </div>`;
            slots.insertAdjacentHTML("beforeend", html);
        }
    } else if (input.value === "") {
        while (slots.firstChild) {
            slots.removeChild(slots.firstChild);
        }
        let html = `
            <div class="item">
                <h1>It's me again</h1>
            </div>`;
        slots.insertAdjacentHTML("beforeend", html);
    };

};