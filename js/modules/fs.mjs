import { stdout } from "./stdout.mjs";
import { files } from "./file_list.mjs";

export const DIRECTORY  = { className: "file file-d", },
             TEXT       = { className: "file file-f", },
             EXECUTABLE = { className: "file file-e", };

const hash = {
    "~": {
        name: "~",
        path: "~",
        type: DIRECTORY,
        contents: [],
    },
};

export const fs = (() => {
    files.forEach(file => {
        const hierarchy = file.split("/");
        let parentObj = hash["~"];
        let parentPath = parentObj.name;

        hierarchy.forEach((name, depth) => {
            const thisPath = `${parentPath}/${name}`;
            let thisFileObj = hash[thisPath];

            if(!thisFileObj) {
                thisFileObj = { name: name, path: thisPath, parentD: parentObj };
                hash[thisPath] = thisFileObj
                parentObj.contents.push(thisFileObj);

                if(depth < hierarchy.length - 1) { // TODO: Handle empty directories.
                    thisFileObj.type = DIRECTORY;
                    thisFileObj.contents = [];
                } else if(name.endsWith(".nsh")) {
                    thisFileObj.type = EXECUTABLE;
                } else {
                    thisFileObj.type = TEXT; // TODO: Obviously these aren't all text.
                }
            }

            parentObj = thisFileObj;
            parentPath = thisPath;
        });
    });

    return [ hash["~"], ];
})();

export const getFile = function(path, ctx) {
    if(path.startsWith("../")) {
        const newCtx = !!ctx.parentD ? ctx.parentD : ctx;
        return getFile(path.substring(3), ctx.parentD);
    } else if(path.startsWith("./")) {
        return getFile(path.substring(2), ctx);
    } else if(path.startsWith("/")) {
        return getFile(`~${path}`, hash["~"]);
    }
    return hash[ path.startsWith("~") ? path : `${ctx.path}/${path}`];
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
