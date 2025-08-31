export function println(outputText, setHtml) {
    const outputDiv  = document.createElement("div");

    if(setHtml) {
        outputDiv.innerHTML = outputText;
    } else {
        const outputTextNode = document.createTextNode(outputText);
        outputDiv.appendChild(outputTextNode);
    }

    outputDiv.classList.add("output");
    document.body.insertBefore(outputDiv, active_prompt_container);
}

export const stdout = { println: println };
