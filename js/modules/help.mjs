import { commands } from "../nsh.mjs";
import { println } from "./stdout.mjs";

function help(args) {
    // TODO: Use args for specific help.
    let output = "Available commands:\n\n";

    commands.forEach(cmd => {
        output += `${cmd.name.padEnd(8, " ")} - ${cmd.help}\n`;
    });
    
    println(output, false);
}

export const cmd_help = {
    name: "help",
    execute: help,
    help: "Show this help dialogue",
};
export const cmd_help_alias = {
    name: "?",
    execute: help,
    help: "Alias for \"help\"",
};
