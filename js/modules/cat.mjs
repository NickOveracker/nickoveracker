import { EXECUTABLE, DIRECTORY, getFile } from "./fs.mjs";
import { stdout } from "./stdout.mjs";

function cat(params) {
    const file   = getFile(params.args[1]);
    let   result = "";

    if(!!file) {
        if(file.type === EXECUTABLE) {
            result = `${params.args[0]}: ${params.args[1]}: Executable file.`;
        } else if(file.type === DIRECTORY) {
            result = `${params.args[0]}: ${params.args[1]}: Directory.`;
        } else {
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", `./files/${params.args[1]}`, false);
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
    help: "Display the contents of a file"
};
