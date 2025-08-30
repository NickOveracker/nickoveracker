import { EXECUTABLE, DIRECTORY, getFile } from "./fs.mjs";
import { println } from "./stdout.mjs";

function cat(args) {

    const file = getFile(args[1]);
    let result = null;

    if(!!file) {
        if(file.type === EXECUTABLE) {
            result = `${args[0]}: ${args[1]}: Executable file.`;
        } else if(file.type === DIRECTORY) {
            result = `${args[0]}: ${args[1]}: Directory.`;
        } else {
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", `./files/${args[1]}`, false);
            xmlhttp.send();
            result = xmlhttp.status==200 ? xmlhttp.responseText : `ERROR: Internet's broken :(`;
        }
    } else if(args.length > 1) {
            result = `${args[0]}: ${args[1]}: No such file or directory`;
    } else {
        result = `USAGE: ${args[0]} filename`;
    }

    println(result, false);
}

export const cmd_cat = {
    name: "cat",
    execute: cat,
    help: "Display the contents of a file"
};
