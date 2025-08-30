import { println } from "./stdout.mjs";

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

export const cmd_cat = {
    name: "cat",
    execute: cat,
    help: "Display the contents of a file"
};
