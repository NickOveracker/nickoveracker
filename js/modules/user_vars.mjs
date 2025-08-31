import { commands } from "../nsh.mjs";
import { stdout } from "./stdout.mjs";

export const NULL = {};

let vars = {
}

// Courtesy of Sudhir Bastakoti and Robert Harvey:
// https://stackoverflow.com/a/9716488/2535523
export const isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const isInQuotes = function(str) {
    const result = str.startsWith('"') && str.endsWith('"');
    // Using the ASCII code \x22 below to keep Vim syntax highlighting happy.
    return result && (str.match(/\x22/g) || []).length === 2;
}

export const get = function(params) {
    const inputs = params.args;

    if(inputs.length > 1 && inputs[1] !== undefined) {
        return vars[inputs[1]];
    }

    return NULL;
}

// TODO: This function is atrocious. Clean it up.
export const set = function(params) {
    const inputs = params.args;
    const ostream = params.ostream || stdout;

    if(inputs.length > 2) {
        if(isInQuotes(inputs[2])) {
            vars[inputs[1]] = inputs[2].substring(1, inputs[2].length - 1);
        } else if(isNumeric(inputs[2])) {
            vars[inputs[1]] = inputs[2];
        } else {
            const command = commands.find(cmd => cmd.name === inputs[2]);

            if(!!command) {
                const buffer = {
                    data: [],
                    println: function(str) { this.data.push(str); },
                };
                command.execute({args: inputs.splice(2), ostream: buffer});
                vars[inputs[1]] = buffer.data[0] || "";
            } else {
                ostream.println(`${inputs[0]}: ERROR: Invalid input.`);
                return; // Seriously? Returning here? Needs serious refactoring.
            }
        }

    } else if(inputs.length > 1) {
        vars[inputs[1]] = "";
    }

    ostream.println(vars[inputs[1]]);
}

export const cmd_get = {
    name: "get",
    help: "Get the value of a variable",
    execute: params => {
        const res = get(params);
        (params.ostream || stdout).println(res === NULL ? "" : res);
    },
    showHelp: true,
};

export const cmd_set = {
    name: "set",
    help: "Set the value of a variable",
    execute: set,
    showHelp: true,
};
