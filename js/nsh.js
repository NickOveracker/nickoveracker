// Always keep focus on the editor

const DIRECTORY  = { className: "file file-d", },
      TEXT       = { className: "file file-f", },
      EXECUTABLE = { className: "file file-e", };

const fs = [ 
    {
        name: "~",
        type: DIRECTORY,
        contents: [
            { type: TEXT, name: "cv.md" },
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

function openStixu(_args) {
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

function ls(args) {
    const dir = args.length > 1 ? args[1] : pwd;
    let output = "";
    pwd.contents.forEach(file => {
        output += `<span class="${file.type.className}">${file.name}</span>\t`;
    });

    output = output.substring(0, output.length-1);

    printOutput(output, true);
}

function help(args) {
    // TODO: Use args for specific help.
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

    const inputTokens = inputText.trim().split(/\s+/);
    if(inputTokens.length > 0) {
        let cmd = commands.find(cmd => cmd.name === inputTokens[0]);
        cmd ??= pwd.contents.find(cmd => cmd.type === EXECUTABLE && cmd.name === inputTokens[0]);
        if(!!cmd) {
            cmd.handler(inputTokens);
        } else {
            printOutput(`command not found: ${inputTokens[0]}`);
        }
    }
}

function cat(args) {

    let result;

    if(args.length > 1) {
        let result = null;
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", `./files/${args[1]}`, false);
        xmlhttp.send();
        result = xmlhttp.status==200 ? xmlhttp.responseText : `${args[0]}: ${args[1]}: No such file or directory`
    } else result = `USAGE: ${args[0]} filename`;

    printOutput(result);
}

// Courtesy of epascarello: https://stackoverflow.com/a/58980415/2535523
active_prompt.addEventListener('paste', function (e) {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
})

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();    // block newline insertion
      e.stopPropagation();   // stop it from bubbling further
      execute();
    } else if (document.activeElement !== active_prompt) {
      active_prompt.focus();
    }
});
