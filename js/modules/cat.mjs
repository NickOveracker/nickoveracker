import { EXECUTABLE, DIRECTORY, getFile, pwd } from "./fs.mjs";
import { stdout } from "./stdout.mjs";

function cat(params) {
    const file   = getFile(params.args[1], pwd);
    let   result = "";

    if(!!file) {
        if(file.type === DIRECTORY) {
            result = `${params.args[0]}: ${params.args[1]}: Is a directory`;
        } else {
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", `./files/${file.path.substring(2)}`, false);
            xmlhttp.overrideMimeType("text/plain"); // Suppress XML parsing errors.
            xmlhttp.send();
            result = xmlhttp.status==200 ? xmlhttp.responseText : `ERROR: Internet's broken :(`;
        }
    } else if(params.args.length > 1) {
            result = `${params.args[0]}: ${params.args[1]}: No such file or directory`;
    } else {
        result = `USAGE: ${params.args[0]} filename`;
    }

    (params.ostream || stdout).println(result, false);
}

export const cmd_cat = {
    name: "cat",
    execute: cat,
    help: "Display the contents of a file",
    showHelp: true,
};

export const cat_cmds = [ cmd_cat ];
