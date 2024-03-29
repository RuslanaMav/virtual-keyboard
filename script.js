let language;
if (localStorage.getItem('lan') === null) language = false;
else {
    if (localStorage.getItem('lan') === "true") language = true;
    else language = false;
}
function setLocalStorage() {
    localStorage.setItem('lan', language);
}
window.addEventListener('beforeunload', setLocalStorage);

document.addEventListener('keydown', function (event) {
    document.querySelector("." + event.code).classList.add("active");
    textArea.focus();
    if (event.code === "CapsLock") changeCase();
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        shiftCount = true;
        shiftChange();
    }
    if (event.code === "Tab") tabAction();
    if (event.code === "AltRight") return;
});

document.addEventListener('keyup', function (event) {
    document.querySelector("." + event.code).classList.remove("active");
    textArea.focus();
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        shiftCount = false;
        shiftChangeBack();
    }
});

let divMain = document.createElement("div");
divMain.className = "content";
document.body.appendChild(divMain);

let textArea = document.createElement("textarea");
textArea.className = "textArea";
divMain.appendChild(textArea);

let divKey = document.createElement("div");
divKey.className = "keyboard";
divMain.appendChild(divKey);

let p = document.createElement("p");
p.innerHTML = "Клавиатура создана в операционной системе MacOS <br> Для переключения языка: левыe control (ctrl) + option (alt)";
divMain.appendChild(p);

textArea.focus();

const Eng = {
    0: ["&sect;", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "-", "="],
    1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",],
    2: ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "&#92;"],
    3: ["`", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/"]
}

const Ru = {
    0: ["&gt;", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "-", "="],
    1: ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"],
    2: ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "ё"],
    3: ["]", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "/"]
}

const nameKey = {
    0: ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal"],
    1: ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"],
    2: ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Backslash"],
    3: ["IntlBackslash", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash"]
}

for (let i = 0; i < 4; i++) {
    let keyRow = document.createElement("div");
    keyRow.className = "key-row";
    divKey.appendChild(keyRow);
    for (let j = 0; j < Eng[i].length; j++) {
        let key;
        if (language) key = createKey(Ru[i][j], "button " + nameKey[i][j]);
        else key = createKey(Eng[i][j], "button " + nameKey[i][j]);
        createActive(key);
        keyRow.appendChild(key);
    }
}

const k = document.getElementsByClassName("key-row");

let backKey = createKey("Backspace", "buttonservice Backspace");
k[0].appendChild(backKey);
backKey.addEventListener('click', () => {
    let s = textArea.value;
    let position = getPosInRow(textArea);
    if (position !== 0) textArea.value = s.slice(0, position - 1) + s.slice(position);
    else return;
    textArea.setSelectionRange(position - 1, position - 1);
});

let tabKey = createKey("Tab", "buttonservice Tab");
k[1].prepend(tabKey);
tabKey.addEventListener('click', () => {
    tabAction();
});

function tabAction () {
    let s = textArea.value;
    let position = getPosInRow(textArea);
    if (s.length === 0 || getPosInRow(textArea) === s.length) textArea.value += "    ";
    else textArea.value = s.slice(0, position) + "    " + s.slice(position);
    textArea.setSelectionRange(position + 4, position + 4);
}

let enterKey = createKey("Enter", "buttonservice Enter");
k[1].appendChild(enterKey);
k[2].style.marginRight = "10%";
enterKey.addEventListener('click', () => {
    let s = textArea.value;
    let position = getPosInRow(textArea);
    if (getPosInRow(textArea) === s.length) textArea.value += "\n";
    else if (getPosInRow(textArea) === 0) textArea.value = "\n" + s;
    else textArea.value = s.slice(0, position) + "\n" + s.slice(position);
    textArea.setSelectionRange(position + 1, position + 1);
});

let count = false;
let capsKey = createKey("CapsLock", "buttonservice CapsLock");
k[2].prepend(capsKey);
capsKey.addEventListener('click', () => {
    document.querySelector(".CapsLock").classList.toggle("active");
    changeCase();
});

const shiftAdditEng = {
    1: ["±", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+"],
    2: ["&sect;", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "-", "="]
}

const shiftAdditRu = {
    1: ["<", "!", "&#34;", "№", "%", ":", ",", ".", ";", "(", ")", "_", "+"],
    2: [">", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "-", "="]
}

const shiftAdditBack = {
    1: ["[", "]", ";", "'", "&#92;", ",", ".", "`"],
    2: ["{", "}", ":", "&#34;", "|", "<", ">", "~"],
    3: [".BracketLeft", ".BracketRight", ".Semicolon", ".Quote", ".Backslash", ".Comma", ".Period", ".IntlBackslash"]
}

const r = k[0].querySelectorAll(".button");

let shiftKey = createKey("Shift", "buttonservice ShiftLeft");
k[3].prepend(shiftKey);

let upKey = createKey("&#9650;", "buttonservice ArrowUp");
k[3].appendChild(upKey);
createActive(upKey);

let shift1Key = createKey("Shift", "buttonservice ShiftRight");
k[3].appendChild(shift1Key);

let shiftCount = false;
shiftKey.addEventListener('click', () => {
    shiftActive(0);
});

shift1Key.addEventListener('click', () => {
    shiftActive(1);
});

let keyRow4 = document.createElement("div");
keyRow4.className = "key-row";
divKey.appendChild(keyRow4);
keyRow4.style.paddingRight = "7px";

let controlKey = createKey("Control", "buttonservice ControlLeft");
keyRow4.appendChild(controlKey);

let altKey = createKey("Option", "buttonservice AltLeft");
keyRow4.appendChild(altKey);

let metaKey = createKey("Command", "buttonservice MetaLeft");
keyRow4.appendChild(metaKey);


let spaceKey = createKey(" ", "buttonservice Space");
keyRow4.appendChild(spaceKey);
spaceKey.addEventListener('click', () => {
    let s = textArea.value;
    let position = getPosInRow(textArea);
    if (s.length === 0 || getPosInRow(textArea) === s.length) textArea.value += " ";
    else textArea.value = s.slice(0, position) + " " + s.slice(position);
    textArea.setSelectionRange(position + 1, position + 1);
});

let meta1Key = createKey("Command", "buttonservice MetaRight");
keyRow4.appendChild(meta1Key);

let alt1Key = createKey("Option", "buttonservice AltRight");
keyRow4.appendChild(alt1Key);

let leftKey = createKey("&#9668;", "buttonservice ArrowLeft");
k[4].appendChild(leftKey);
createActive(leftKey);

let downKey = createKey("&#9660;", "buttonservice ArrowDown");
k[4].appendChild(downKey);
createActive(downKey);

let rightKey = createKey("&#9658;", "buttonservice ArrowRight");
k[4].appendChild(rightKey);
createActive(rightKey);

const button = document.querySelectorAll("button");
for (let i of button)
    i.addEventListener("click", () => textArea.focus());

let array = [];
for (let i of button) {
    i.addEventListener("click", () => {
        let a = i.className.slice(i.className.indexOf(" "))
        if (a === " ControlLeft") array[0] = " ControlLeft";
        else array.push(a);
        if (array.length === 2) {
            if (array[0] === " ControlLeft" && array[1] === " AltLeft") {
                if (language) language = false;
                else language = true;
                changeLanguage();
                if (shift1Key.classList.contains('active') || shiftKey.classList.contains('active')) {
                    shiftChangeBack();
                    shift1Key.classList.remove("active");
                    shiftKey.classList.remove("active");
                    shiftCount = false;
                }
                if (capsKey.classList.contains('active')){
                    count = false;
                    changeCase();
                }
            }
            array.length = 0;
        }
    })
}

function createKey(value, cl) {
    let key = document.createElement("button");
    key.innerHTML = value;
    key.className = cl;
    return key;
}

function createActive(obj) {
    obj.addEventListener('click', () => {
        let s = textArea.value;
        let position = getPosInRow(textArea);
        if (s.length === 0 || getPosInRow(textArea) === s.length) textArea.value += obj.innerText;
        else textArea.value = s.slice(0, position) + obj.innerText + s.slice(position);
        textArea.setSelectionRange(position + 1, position + 1);
    });
}

function getCaret(el) {
    if (el.selectionStart) return el.selectionStart;
    else if (document.selection) {
        let r = document.selection.createRange();
        if (r === null) return 0;
        let re = el.createTextRange(),
            rc = re.duplicate();
        re.moveToBookmark(r.getBookmark());
        rc.setEndPoint('EndToStart', re);
        return rc.text.length;
    }
    return 0;
}

function getPosInRow(el) {
    let text = el.value.substr(0, getCaret(el));
    return text.length;
}

function changeCase() {
    let button = document.getElementsByClassName("button");
    if (!count) {
        count = true;
        for (let i of button)
            i.innerHTML = i.innerText.toUpperCase();
    }
    else {
        count = false;
        for (let i of button)
            i.innerHTML = i.innerText.toLowerCase();
    }
}

function shiftActive(s) {
    if (!shiftCount) {
        if (s === 0) shiftKey.classList.add("active");
        else shift1Key.classList.add("active");
        shiftCount = true;
        shiftChange();
    }
    else {
        if (s === 0) shiftKey.classList.remove("active");
        else shift1Key.classList.remove("active");
        shiftCount = false;
        shiftChangeBack();
    }
}

function shiftChangeBack() {
    changeCase();
    for (let i = 0; i < r.length; i++)
        if (!language) r[i].innerHTML = shiftAdditEng[2][i];
        else r[i].innerHTML = shiftAdditRu[2][i];
    if (!language)
        for (let i = 0; i < shiftAdditBack[1].length; i++)
            document.querySelector(shiftAdditBack[3][i]).innerHTML = shiftAdditBack[1][i];
    else document.querySelector(".IntlBackslash").innerHTML = "]";
    document.querySelector(".Slash").innerHTML = "/";
}

function shiftChange() {
    changeCase();
    for (let i = 0; i < r.length; i++)
        if (!language)
            r[i].innerHTML = shiftAdditEng[1][i];
        else r[i].innerHTML = shiftAdditRu[1][i];
    if (!language)
        for (let i = 0; i < shiftAdditBack[1].length; i++)
            document.querySelector(shiftAdditBack[3][i]).innerHTML = shiftAdditBack[2][i];
    else document.querySelector(".IntlBackslash").innerHTML = "[";
    document.querySelector(".Slash").innerHTML = "?";
    let button = document.getElementsByClassName("button");
    for (let i = 0; i < button.length; i++) {
        button[i].addEventListener('click', () => {
            if (shiftCount) {
                shiftCount = false;
                shift1Key.classList.remove("active");
                shiftKey.classList.remove("active");
                shiftChangeBack();
            }
        });
    }
}

function changeLanguage() {
    for (let i = 0; i < 4; i++) {
        const button = k[i].querySelectorAll(".button");
        for (let j = 0; j < button.length; j++) {
            if (language) button[j].innerHTML = Ru[i][j];
            if (!language) button[j].innerHTML = Eng[i][j];
        }
    }
}

(function (...codes) {
    let set = new Set();
    document.addEventListener('keydown', function (event) {
        set.add(event.code);
        for (let code of codes)
            if (!set.has(code)) return;
        set.clear();
        if (language) language = false;
        else language = true;
        changeLanguage();
        if (capsKey.classList.contains('active')) {
            count = false;
            changeCase();
        }
    });
    document.addEventListener('keyup', function (event) {
        set.delete(event.code);
    });
})("ControlLeft", "AltLeft")