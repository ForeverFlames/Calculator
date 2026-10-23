const inputScreen = document.getElementById("input");
const outputScreen = document.getElementById("output");

const typingKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "*", "/", "^", "%", "(", ")"];
const operatorKeys = ["+", "-", "*", "/", "^", "%"];
const digitValues = { "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9 };

let expression = "";
let result = "";
let showingAnswer = false;

let historyList = JSON.parse(localStorage.getItem("calculatorHistory"));
if (historyList === null) {
    historyList = [];
}
let historyIndex = historyList.length;

let text = "";
let position = 0;
let hasError = false;

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (isInList(key, typingKeys)) {
        press(key);
    } else if (key === "Enter" || key === "=") {
        calculate();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape" || key === "Delete") {
        clearAll();
    } else if (key === "ArrowLeft") {
        goBack();
    } else if (key === "ArrowRight") {
        goForward();
    }
});

function isInList(item, list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i] === item) {
            return true;
        }
    }
    return false;
}

function press(key) {
    if (showingAnswer) {
        if (isInList(key, operatorKeys) && result !== "Error") {
            expression = "" + result;
        } else {
            expression = "";
        }
        result = "";
        showingAnswer = false;
        historyIndex = historyList.length;
    }

    expression = expression + key;
    updateScreen();
}

function deleteLast() {
    if (showingAnswer) {
        result = "";
        showingAnswer = false;
        historyIndex = historyList.length;
    }

    if (expression.length > 0) {
        expression = expression.substring(0, expression.length - 1);
    }

    updateScreen();
}

function clearAll() {
    expression = "";
    result = "";
    showingAnswer = false;
    historyIndex = historyList.length;
    updateScreen();
}

function calculate() {
    if (expression === "" || showingAnswer) {
        return;
    }

    text = expression;
    position = 0;
    hasError = false;

    const answer = readSum();

    if (position < text.length || !isValidNumber(answer)) {
        hasError = true;
    }

    if (hasError) {
        result = "Error";
        historyIndex = historyList.length;
    } else {
        result = roundAnswer(answer);
        historyList.push({ equation: expression, answer: result });
        localStorage.setItem("calculatorHistory", JSON.stringify(historyList));
        historyIndex = historyList.length - 1;
    }

    showingAnswer = true;
    updateScreen();
}

function goBack() {
    if (historyIndex > 0) {
        historyIndex--;
        showHistoryEntry();
    }
}

function goForward() {
    if (historyIndex < historyList.length - 1) {
        historyIndex++;
        showHistoryEntry();
    }
}

function showHistoryEntry() {
    expression = historyList[historyIndex].equation;
    result = historyList[historyIndex].answer;
    showingAnswer = true;
    updateScreen();
}

function peek() {
    return text.charAt(position);
}

function isDigit(char) {
    return char >= "0" && char <= "9";
}

function readSum() {
    let value = readProduct();

    while (peek() === "+" || peek() === "-") {
        const operator = peek();
        position++;
        const right = readProduct();
