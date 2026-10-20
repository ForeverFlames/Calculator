const inputScreen = document.getElementById("input");
const outputScreen = document.getElementById("output");
const keys = document.querySelectorAll(".key");

let expression = "";
let result = "";

let tokens = [];
let position = 0;

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
            calculate();
            break;

        case "left":
        case "right":
            console.log(action + " pressed");
            break;
    }
}

function calculate() {
    if (expression === "") {
        return;
    }

    try {
        tokens = tokenize(expression);
        position = 0;

        const answer = parseExpression();

        if (position < tokens.length) {
            throw new Error("Unexpected " + tokens[position]);
        }

        if (!isFinite(answer)) {
            throw new Error("Not a finite number");
        }

        result = formatNumber(answer);
    } catch (error) {
        result = "Error";
    }

    updateScreen();
}

function tokenize(text) {
    const list = [];
    let i = 0;

    while (i < text.length) {
        const char = text[i];

        if (isDigit(char) || char === ".") {
            let numberText = "";

            while (i < text.length && (isDigit(text[i]) || text[i] === ".")) {
                numberText += text[i];
                i++;
            }

            const number = Number(numberText);

            if (isNaN(number)) {
                throw new Error("Bad number: " + numberText);
            }

            list.push(number);
        } else if ("+-*/^()%".includes(char)) {
            list.push(char);
            i++;
        } else {
            throw new Error("Unknown character: " + char);
        }
    }

    return list;
}

function isDigit(char) {
    return char >= "0" && char <= "9";
}

function peek() {
    return tokens[position];
}

function next() {
    return tokens[position++];
}

function parseExpression() {
    let value = parseTerm();

    while (peek() === "+" || peek() === "-") {
        const operator = next();
        const right = parseTerm();

        if (operator === "+") {
            value = value + right;
        } else {
            value = value - right;
        }
    }

    return value;
}

function parseTerm() {
    let value = parsePower();

    while (peek() === "*" || peek() === "/") {
        const operator = next();
        const right = parsePower();

        if (operator === "*") {
            value = value * right;
        } else {
            if (right === 0) {
                throw new Error("Can't divide by zero");
            }
            value = value / right;
        }
    }

    return value;
}

function parsePower() {
    const base = parseFactor();

    if (peek() === "^") {
        next();
        const exponent = parsePower();
        return Math.pow(base, exponent);
    }

    return base;
}



function parseFactor() {
    const token = next();

    if (typeof token === "number") {
        return token;
    }

    if (token === "(") {
        const value = parseExpression();

        if (next() !== ")") {
            throw new Error("Missing )");
        }

        return value;
    }

    throw new Error("Unexpected " + token);
}


function formatNumber(number) {
    return String(parseFloat(number.toFixed(10)));
}

function updateScreen() {
    inputScreen.textContent = expression;
    outputScreen.textContent = result;
}


