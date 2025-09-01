import { fs_cmds, fs, pwd, EXECUTABLE } from "./modules/fs.mjs";
import { clear_cmds }                   from "./modules/clear.mjs";
import { vars_cmds  }                   from "./modules/user_vars.mjs";
import { math_cmds  }                   from "./modules/math.mjs";
import { cat_cmds, cmd_cat as cat }     from "./modules/cat.mjs";
import { help_cmds  }                   from "./modules/help.mjs";
import { nav_cmds }                     from "./modules/nav.mjs";
import { println }                      from "./modules/stdout.mjs";
//import { cmd_latn }                     from "./modules/nlp.mjs";

export const commands = [
    ...help_cmds,
    ...cat_cmds,
    ...clear_cmds,
    ...fs_cmds,
    ...vars_cmds,
    ...math_cmds,
    ...nav_cmds,
    //cmd_latn,
];

function resolveCommand(inputs, ctx) {
    let executable = ctx.contents.find(cmd => {
        return cmd.type === EXECUTABLE && cmd.name === inputs[0];
    });

    if(!!executable) {
        let buffer = "";
        cat.execute({
            args: [ null, `${ctx.path}/${inputs[0]}`],
            ostream: {
                println: function(str) {
                    buffer += str;
                },
            },
        });

        return resolveCommand(buffer.trim().split(/\s+/), ctx);
    } else {
        let builtinCmd = commands.find(cmd => cmd.name === inputs[0]);
        return !!builtinCmd ? { execute: builtinCmd.execute, args: inputs } : null;
    }
}

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
        // TODO: This needs to be in its own function. Need to evaluate expressions right to left.
        const cmd = resolveCommand(inputTokens, pwd);

        if(!!cmd) {
            cmd.execute({args: cmd.args});
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

