import type {TextFormatTransformer, ElementTransformer} from '@lexical/markdown';
import {CODE} from '@lexical/markdown';

export const WHATSAPP_TRANSFORMERS: Array<TextFormatTransformer | ElementTransformer> = [
    {
        format: ['bold'],
        tag: '*',
        type: 'text-format',
    },
    {
        format: ['italic'],
        tag: '_',
        type: 'text-format',
    },
    {
        format: ['strikethrough'],
        tag: '~',
        type: 'text-format',
    },
    {
        format: ['code'],
        tag: '`', // <-- Single backtick for inline code (Modern WhatsApp)
        type: 'text-format',
    },
    CODE, // <-- Lexical's built-in rule for multiline ``` blocks
];