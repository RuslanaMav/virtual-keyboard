let language = true;

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
});




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


