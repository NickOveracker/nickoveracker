import { pwd } from "./fs.mjs";
import { println } from "./stdout.mjs";

function ls(args) {
    const dir = args.length > 1 ? args[1] : pwd;
    let output = "";

    dir.contents.forEach(file => {
        output += `<span class="${file.type.className}">${file.name}</span>\t`;
    });

    output = output.substring(0, output.length-1);

    println(output, true);
}

export const cmd_ls = {
    name: "ls",
    execute: ls,
    help: "List files in the current directory",
};
