import { println } from "./stdout.mjs";
import { get, set } from "./user_vars.mjs";

// Courtesy of Sudhir Bastakoti and Robert Harvey:
// https://stackoverflow.com/a/9716488/2535523
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function add(args) {
    const inputs = args.slice(1);
    if(inputs.every(arg => isNumeric(arg))) {
        return inputs.reduce((sum, str) => { return parseFloat(str) + sum; }, 0);
    }
    return NaN;
}

export const cmd_add = {
    name: "add",
    help: "Add numbers",
    execute: args => { println(add(args)); },
};
