import { fs_cmds, fs, pwd, EXECUTABLE } from "./modules/fs.mjs";
import { clear_cmds }                   from "./modules/clear.mjs";
import { vars_cmds  }                   from "./modules/user_vars.mjs";
import { math_cmds  }                   from "./modules/math.mjs";
import { cat_cmds, cmd_cat as cat }     from "./modules/cat.mjs";
import { help_cmds  }                   from "./modules/help.mjs";
import { nav_cmds }                     from "./modules/nav.mjs";
import { stdout }                       from "./modules/stdout.mjs";
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

const nostream = {
    println: (_) => {},
}

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

        const lines = buffer.trim().split(/[\r\n]+/);
        let cmds = [];
        lines.forEach(line => {
            // TODO: ctx can be changed by the script.
            cmds = cmds.concat(resolveCommand(line.trim().split(/\s+/), ctx))
        });
        return cmds;
    } else {
        let builtinCmd = commands.find(cmd => cmd.name === inputs[0]);
        return !!builtinCmd ? [ { execute: builtinCmd.execute, args: inputs } ] : [ null ];
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
        const cmds = resolveCommand(inputTokens, pwd);

        cmds.every((cmd, idx) => {
            let ok = true;

            if(!!cmd) {
                cmd.execute({
                    args: cmd.args,
                    ostream: idx == cmds.length - 1 ? stdout : nostream,
                });
            } else {
                stdout.println(`command not found: ${inputTokens[0]}`, false);
                ok = false;
            }

            return ok;
        });
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

