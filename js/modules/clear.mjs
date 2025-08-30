function clear(_args) {
    const divs = document.querySelectorAll("div:not(.active-prompt-container)");
    [...divs].forEach(div => div.remove());
}

export const cmd_clear = {
    name: "clear",
    execute: clear,
    help: "Clear the screen",
};
