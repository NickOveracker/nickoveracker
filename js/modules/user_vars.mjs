import { println } from "./stdout.mjs";

export const NULL = {};

let vars = {
}

export const get = function(args) {
    if(args.length > 1 && vars[args[1]] !== undefined) {
        return vars[args[1]];
    }

    return NULL;
}

export const set = function(args) {
    if(args.length > 2) {
        vars[args[1]] = args[2];
    } else if(args.length > 1) {
        vars[args[1]] = "";
    }
}

export const cmd_get = {
    name: "get",
    help: "Get the value of a variable",
    execute: args => {
        const res = get(args);
        println(res === NULL ? "" : res);
    },
};

export const cmd_set = {
    name: "set",
    help: "Set the value of a variable",
    execute: set,
};
