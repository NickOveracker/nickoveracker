export const cmd_nav = {
    name: "nav",
    help: "Open a URL in a new tab",
    showHelp: true,
    execute: params => {
        window.open(params.args[1], "_blank").focus();
        return params.args.splice(2);
    },
};

export const nav_cmds = [ cmd_nav ];
