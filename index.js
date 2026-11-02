const inputScreen = document.getElementById("input");
const outputScreen = document.getElementById("output");

const typingKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "*", "/", "^", "%", "(", ")"];
const operatorKeys = ["+", "-", "*", "/", "^", "%"];

let expression = "";
let result = "";
let showingAnswer = false;

let historyList = JSON.parse(localStorage.getItem("calculatorHistory"));
if (historyList === null) {
    historyList = [];
}
let historyIndex = historyList.length;

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

    result = "Error";
    showingAnswer = true;
    historyIndex = historyList.length;
    updateScreen();

    const answer = eval(toJavaScript(expression));

    if (isValidNumber(answer)) {
        result = roundAnswer(answer);
        historyList.push({ equation: expression, answer: result });
        localStorage.setItem("calculatorHistory", JSON.stringify(historyList));
        historyIndex = historyList.length - 1;
        updateScreen();
    }
}

function toJavaScript(equation) {
    let converted = "";

    for (let i = 0; i < equation.length; i++) {
        if (equation.charAt(i) === "^") {
            converted = converted + "**";
        } else {
            converted = converted + equation.charAt(i);
        }
    }

    return converted;
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

function isValidNumber(number) {
    return number - number === 0;
}

function roundAnswer(number) {
    if (number > 100000 || number < -100000) {
        return number;
    }

    let scaled = number * 10000000000;
    const leftover = scaled % 1;
    scaled = scaled - leftover;

    if (leftover >= 0.5) {
        scaled = scaled + 1;
    } else if (leftover <= -0.5) {
        scaled = scaled - 1;
    }

    return scaled / 10000000000;
}

function updateScreen() {
    inputScreen.innerText = expression;
    outputScreen.innerText = result;
}

