import { cmd_pwd, fs, pwd, EXECUTABLE } from "./modules/fs.mjs";
import { cmd_clear }                    from "./modules/clear.mjs";
import { cmd_ls }                       from "./modules/ls.mjs";
import { println }                      from "./modules/stdout.mjs";
import { cmd_set, cmd_get }             from "./modules/user_vars.mjs";
import { cmd_add }                      from "./modules/math.mjs";
import { cmd_cat }                      from "./modules/cat.mjs";
import { cmd_help, cmd_help_alias }     from "./modules/help.mjs";

export const commands = [
    cmd_help,
    cmd_help_alias,
    cmd_cat,
    cmd_clear,
    cmd_ls,
    cmd_pwd,
    cmd_set,
    cmd_get,
    cmd_add,
];

function execute() {
    const inputDiv  = document.createElement("div");
    const inputText = active_prompt.innerText;
    const inputTextNode = document.createTextNode(`${inputText}`);
    inputDiv.classList.add("prompt");
    inputDiv.appendChild(inputTextNode);
    active_prompt.innerText = "";
    //active_prompt.style.visibility = "hidden";
    document.body.insertBefore(inputDiv, active_prompt_container);

    const inputTokens = inputText.trim().split(/\s+/);
    if(inputTokens.length > 0) {
        let cmd = commands.find(cmd => cmd.name === inputTokens[0]);
        cmd ??= pwd.contents.find(cmd => cmd.type === EXECUTABLE && cmd.name === inputTokens[0]);
        if(!!cmd) {
            cmd.execute(inputTokens);
        } else {
            println(`command not found: ${inputTokens[0]}`, false);
        }
    }

    window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
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

active_prompt_container.addEventListener("click", (e) => {
    active_prompt.focus();
});

