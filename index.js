const inputScreen = document.getElementById("input");
const outputScreen = document.getElementById("output");
const keys = document.querySelectorAll(".key");

let expression = "";
let result = "";

keys.forEach(function (key) {
    key.addEventListener("click", function () {
        handleKey(key);
    });
});

function handleKey(key) {
    const value = key.dataset.value;
    const action = key.dataset.action;

    if (value) {
        expression += value;
        updateScreen();
        return;
    }

    switch (action) {
        case "equals":
            console.log("= pressed, expression is:", expression);
            break;

        case "left":
        case "right":
            console.log(action + " pressed");
            break;
    }
}

function updateScreen() {
    inputScreen.textContent = expression;
    outputScreen.textContent = result;
}

