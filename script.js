let language = false;

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
p.innerHTML = "Клавиатура создана в операционной системе MacOS <br> Для переключения языка комбинация: левыe control (ctrl) + option (alt)";
divMain.appendChild(p);

textArea.focus();

const Eng = {
    0: ["&sect;", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "-", "="],
    1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",],
    2: ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "&#92;"],
    3: ["`", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/"]
}

const ru = {
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

//main 
for (let i = 0; i < 4; i++) {
    let keyRow = document.createElement("div");
    keyRow.className = "key-row";
    divKey.appendChild(keyRow);
    for (let j = 0; j < Eng[i].length; j++) {
        let key;
        if (language) key = createKey(ru[i][j], "button " + nameKey[i][j]);
        else key = createKey(Eng[i][j], "button " + nameKey[i][j]);
        createActive(key);
        keyRow.appendChild(key);
    }
}

const k = document.getElementsByClassName("key-row");

//Backspace 
let backKey = createKey("Backspace", "buttonservice Backspace");
k[0].appendChild(backKey);
backKey.addEventListener('click', () => {
    let s = textArea.value;
    let position = getPosInRow(textArea);
    if (position !== 0) textArea.value = s.slice(0, position - 1) + s.slice(position);
    textArea.setSelectionRange(position-1,position-1);
    textArea.focus();
})

//Tab
let tabKey = createKey("Tab", "buttonservice Tab");
k[1].prepend(tabKey);
tabKey.addEventListener('click', () => {
    textArea.focus();
    let s = textArea.value;
    let position = getPosInRow(textArea);
    if (s.length === 0 || getPosInRow(textArea) === s.length) textArea.value += "    ";
    else textArea.value = s.slice(0, position) + "    " + s.slice(position);
    textArea.setSelectionRange(position+4,position+4);
});

//Enter
let enterKey = createKey("Enter", "buttonservice Enter");
k[1].appendChild(enterKey);
k[2].style.marginRight = "10%";
enterKey.addEventListener('click', () => {
    textArea.focus();
    let s = textArea.value;
    let position = getPosInRow(textArea);
    if (getPosInRow(textArea) === s.length) textArea.value += "\n";
    else if (getPosInRow(textArea) === 0) textArea.value = "\n" + s;
    else textArea.value = s.slice(0, position) + "\n" + s.slice(position);
    textArea.setSelectionRange(position+1,position+1);

});

//CapsLock
let count = false;
let capsKey = createKey("CapsLock", "buttonservice CapsLock");
k[2].prepend(capsKey);
capsKey.addEventListener('click', () => {
    textArea.focus();
    document.querySelector(".CapsLock").classList.toggle("active");
    changeCase();
});


//Shift 
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
    textArea.focus();
    if (!shiftCount) {
        shiftKey.classList.add("active");
        shiftCount = true;
        shiftChange(shiftKey);
    }
    else {
        shiftKey.classList.remove("active");
        shiftCount = false;
        shiftChangeBack();
    }
})

shift1Key.addEventListener('click', () => {
    textArea.focus();
    if (!shiftCount) {
        shift1Key.classList.add("active");
        shiftCount = true;
        shiftChange(shift1Key);
    }
    else {
        shift1Key.classList.remove("active");
        shiftCount = false;
        shiftChangeBack();
    }
})




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
        textArea.focus();
        textArea.setSelectionRange(position+1,position+1);
    });
}

function getCaret(el) {
    if (el.selectionStart) return el.selectionStart;
    else if (document.selection) {
        let r = document.selection.createRange();
        if (r == null) return 0;
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

function shiftChange(s) {
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
                s.classList.remove("active");
                shiftChangeBack();
            }
        });
    }
}