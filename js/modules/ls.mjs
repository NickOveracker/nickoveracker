import { pwd } from "./fs.mjs";
import { stdout } from "./stdout.mjs";

function ls(params) {
    const dir = params.args.length > 1 ? params.args[1] : pwd;
    let output = "";

    dir.contents.forEach(file => {
        output += `<span class="${file.type.className}">${file.name}</span>\t`;
    });

    output = output.substring(0, output.length-1);

    (params.ostream || stdout).println(output, true);
}

export const cmd_ls = {
    name: "ls",
    execute: ls,
    help: "List files in the current directory",
};
