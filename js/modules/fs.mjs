import { println } from "./stdout.mjs";

export const DIRECTORY  = { className: "file file-d", },
             TEXT       = { className: "file file-f", },
             EXECUTABLE = { className: "file file-e", };

export const fs = [ 
    {
        name: "~",
        type: DIRECTORY,
        contents: [
            { type: TEXT, name: "cv.md" },
            { type: EXECUTABLE, name: "stixu", execute: openStixu},
        ],
    },
];

export let pwd = fs[0];

// END OF EXPORTS

function openStixu(_args) {
    window.open("https://stixu.io", "_blank").focus();
}

export const cmd_pwd = {
    name: "pwd",
    execute: args => { println(pwd.name) },
    help: "Display the current path",
};
