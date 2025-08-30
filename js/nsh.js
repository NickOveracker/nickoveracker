// Always keep focus on the editor

const DIRECTORY  = { className: "file file-d", },
      TEXT       = { className: "file file-f", },
      EXECUTABLE = { className: "file file-e", };

const fs = [ 
    {
        name: "~",
        type: DIRECTORY,
        contents: [
            { type: TEXT, name: "cv.txt" },
            { type: EXECUTABLE, name: "stixu", handler: openStixu},
        ],
    },
];

const commands = [
    {
        name: "ls",
        handler: ls,
    },
    {
        name: "?",
        handler: help,
    },
    {
        name: "help",
        handler: help,
    },
    {
        name: "cat",
        handler: cat,
    }
];

let pwd = fs[0];

function openStixu() {
    window.open("https://stixu.io", "_blank").focus();
}

function printOutput(outputText, setHtml=false) {
    const outputDiv  = document.createElement("div");

    if(setHtml) {
        outputDiv.innerHTML = outputText;
    } else {
        const outputTextNode = document.createTextNode(outputText);
        outputDiv.appendChild(outputTextNode);
    }

    outputDiv.classList.add("output");
    document.body.insertBefore(outputDiv, active_prompt);
}

function ls(dir = pwd) {
    let output = "";
    pwd.contents.forEach(file => {
        output += `<span class="${file.type.className}">${file.name}</span>\t`;
    });

    output = output.substring(0, output.length-1);

    printOutput(output, true);
}

function help() {
    let output = `Available commands:
    
    ls   - List files in the current directory.
    help - Show this help dialogue.
    ?    - Alias for "help".`;

    printOutput(output);
}

function execute() {
    const inputDiv  = document.createElement("div");
    const inputText = active_prompt.innerText;
    const inputTextNode = document.createTextNode(`> ${inputText}`);
    inputDiv.appendChild(inputTextNode);
    active_prompt.innerText = "";
    //active_prompt.style.visibility = "hidden";
    document.body.insertBefore(inputDiv, active_prompt);

    const trimmedInput = inputText.trim();
    let cmd = commands.find(cmd => cmd.name === trimmedInput);
    cmd ??= pwd.contents.find(cmd => cmd.type === EXECUTABLE && cmd.name === trimmedInput);
    if(!!cmd) {
        cmd.handler();
    } else {
        printOutput(`command not found: ${trimmedInput}`);
    }
}

function cat(filePath = "./files/cv.txt") {
    let result = null;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
        result = xmlhttp.responseText;
    }
    printOutput(result);
}

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();    // block newline insertion
      e.stopPropagation();   // stop it from bubbling further
      execute();
    } else if (document.activeElement !== active_prompt) {
      active_prompt.focus();
    }
});
