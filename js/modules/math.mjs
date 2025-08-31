import { stdout } from "./stdout.mjs";
import { get, set, isNumeric } from "./user_vars.mjs";

function add(params) {
    const inputs = params.args.slice(1);
    let sum = 0;

    function _add(arg) {
        sum += parseFloat(arg);
    }

    inputs.some(arg => {
        let badInput = false;

        if(isNumeric(arg)) {
            _add(arg);
        } else {
            let getArg = get({args: [this, arg]});
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
    execute: params => { (params.ostream || stdout).println(add(params)) },
    showHelp: true,
};
