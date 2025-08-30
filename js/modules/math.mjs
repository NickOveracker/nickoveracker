import { println } from "./stdout.mjs";
import { get, set } from "./user_vars.mjs";

// Courtesy of Sudhir Bastakoti and Robert Harvey:
// https://stackoverflow.com/a/9716488/2535523
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function add(args) {
    const inputs = args.slice(1);
    let sum = 0;

    function _add(arg) {
        sum += parseFloat(arg);
    }

    inputs.some(arg => {
        let badInput = false;

        if(isNumeric(arg)) {
            _add(arg);
        } else {
            let getArg = get([this, arg]);
            if(isNumeric(getArg)) {
                _add(getArg);
            } else {
                sum = NaN;
                badInput = true;
            }
        }

        return badInput;
    });

    return sum;
}

export const cmd_add = {
    name: "add",
    help: "Add numbers",
    execute: args => { println(add(args)); },
};
