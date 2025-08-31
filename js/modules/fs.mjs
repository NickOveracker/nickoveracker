import { stdout } from "./stdout.mjs";

export const DIRECTORY  = { className: "file file-d", },
             TEXT       = { className: "file file-f", },
             EXECUTABLE = { className: "file file-e", };

export const fs = [ 
    {
        name: "~",
        type: DIRECTORY,
        contents: [
            { type: TEXT, name: "cv.md" },
            { type: EXECUTABLE, name: "stixu", execute: openStixu },
            { type: EXECUTABLE, name: "ainu-latinizer", execute: openLatinizer },
        ],
    },
];

export const getFile = function(path) {
    // TODO: Don't use pwd.
    return pwd.contents.find(file => file.name === path);
};

/**************
 * PWD COMMAND
 **************/
export const cmd_pwd = {
    name: "pwd",
    execute: args => { (args.ostream || stdout).println(pwd.name); },
    help: "Display the current path",
};

export let pwd = fs[0];

/*************
 * LS COMMAND
 *************/
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
    showHelp: true,
};

export const cmd_dir = {
    name: "dir",
    execute: params => {
        (params.ostream || stdout).println("I see that you are an MSDOS user. In NIXU world we say \"ls\", but I'll allow it.");
        ls(params);
    },
    help: "Alias for \"ls\"",
    showHelp: false,
};

/******************
 * ALL CMDS EXPORT
 ******************/
export const fs_cmds = [ cmd_pwd, cmd_ls, cmd_dir, ];

/**********************
 * EXECUTABLES (LINKS)
 **********************/
function openStixu(_params) {
    window.open("https://stixu.io", "_blank").focus();
}

function openLatinizer(_params) {
    window.open("https://huggingface.co/spaces/TwentyNine/byt5-ain-kana-latin-converter").focus();
}
