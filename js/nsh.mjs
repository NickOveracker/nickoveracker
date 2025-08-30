// Always keep focus on the editor

import { fs, pwd, EXECUTABLE } from "./modules/fs.mjs";
import { ls } from "./modules/ls.mjs";
import { println } from "./modules/stdout.mjs";
import { clear } from "./modules/clear.mjs";

const commands = [
    {
        name: "help",
        handler: help,
    },
    {
        name: "?",
        handler: help,
    },
    {
        name: "ls",
        handler: ls,
    },
    {
        name: "cat",
        handler: cat,
    },
	{
		name: "clear",
		handler: clear,
	},
];

function help(args) {
    // TODO: Use args for specific help.
    let output = `Available commands:
    
	clear - Clears the screen.
    ls    - List files in the current directory.
    cat   - Display the contents of a file.
    help  - Show this help dialogue.
    ?     - Alias for "help".`;

    println(output, false);
}

function execute() {
    const inputDiv  = document.createElement("div");
    const inputText = active_prompt.innerText;
    const inputTextNode = document.createTextNode(`${inputText}`);
	inputDiv.classList.add("prompt");
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
            println(`command not found: ${inputTokens[0]}`, false);
        }
    }

	window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
}

function cat(args) {

    let result = null;

    if(args.length > 1) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", `./files/${args[1]}`, false);
        xmlhttp.send();
        result = xmlhttp.status==200 ? xmlhttp.responseText : `${args[0]}: ${args[1]}: No such file or directory`
    } else result = `USAGE: ${args[0]} filename`;

    println(result, false);
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
