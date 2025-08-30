export const DIRECTORY  = { className: "file file-d", },
             TEXT       = { className: "file file-f", },
             EXECUTABLE = { className: "file file-e", };

export const fs = [ 
    {
        name: "~",
        type: DIRECTORY,
        contents: [
            { type: TEXT, name: "cv.md" },
            { type: EXECUTABLE, name: "stixu", handler: openStixu},
        ],
    },
];

export let pwd = fs[0];

// END OF EXPORTS

function openStixu(_args) {
    window.open("https://stixu.io", "_blank").focus();
}

