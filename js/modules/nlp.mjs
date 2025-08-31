// This doesn't work yet because my models are too big :(

import { AutoModelForSeq2SeqLM, AutoTokenizer } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2";
import { stdout } from "./stdout.mjs";

let model, tokenizer;

export const cmd_latn = {
    name: "latn",
    help: "Convert Saru Ainu text from katakana to Latin script.",
    showHelp: true,
    execute: async function(params) {
        if(!tokenizer) {
            tokenizer = await AutoTokenizer.from_pretrained("TwentyNine/byt5-small-ainu-latinizer-cos_w_restarts-GGUF");
        }
        if(!model) {
            model = await AutoModelForSeq2SeqLM.from_pretrained("TwentyNine/byt5-small-ainu-latinizer-cos_w_restarts-GGUF");
        }

        //let inputs = params.args.reduce((str, arg) => { str + arg }, "");
        let inputs = await tokenizer(params.args.reduce((str, arg) => { str + arg }, ""));
        let output = await model.generate(inputs);
        let decoded = tokenizer.decode(outputs[0], { skip_special_tokens: true });

        (params.ostream || stdout).println(decoded);
    },
};
