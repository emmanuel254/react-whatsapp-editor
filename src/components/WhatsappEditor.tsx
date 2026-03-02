import {forwardRef, useEffect} from 'react';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import type {EditorState} from 'lexical';
import {CodeNode} from '@lexical/code';
import {MarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {$convertFromMarkdownString, $convertToMarkdownString} from '@lexical/markdown';
import {WHATSAPP_TRANSFORMERS} from './whatsappMarkdown';

import './WhatsappEditor.css';
import {ToolbarPlugin} from "./ToolbarPlugin.tsx";
import { AutoCodeBlockPlugin } from './AutoCodeBlockPlugin';
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";

export interface WhatsappEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    theme?: 'light' | 'dark';
    className?: string;
    placeholder?: string;
}

const editorTheme = {
    paragraph: 'wa-editor-paragraph',
    code: 'wa-editor-code-block',
    text: {
        bold: 'wa-editor-text-bold',
        italic: 'wa-editor-text-italic',
        strikethrough: 'wa-editor-text-strikethrough'
    },
};

const MarkdownUpdatePlugin = ({value}: { value?: string }) => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (value === undefined) return;

        editor.update(() => {
            let currentMarkdown = $convertToMarkdownString(WHATSAPP_TRANSFORMERS);
            currentMarkdown = currentMarkdown.replace(/\\([*_~`])/g, '$1').replace(/&#32;/g, ' ').replace(/&nbsp;/g, ' ');
            if (value !== currentMarkdown) {
                $convertFromMarkdownString(value, WHATSAPP_TRANSFORMERS);
            }
        });
    }, [editor, value]);

    return null;
};

export const WhatsappEditor = forwardRef<HTMLDivElement, WhatsappEditorProps>(
    ({value, onChange, theme = 'light', className = '', placeholder = 'Type a message'}, ref) => {

        const initialConfig = {
            namespace: 'WhatsappEditor',
            theme: editorTheme,
            nodes: [CodeNode],
            onError: (error: Error) => console.error('Lexical Error:', error),
        };

        const handleEditorChange = (editorState: EditorState) => {
            editorState.read(() => {
                let markdownString = $convertToMarkdownString(WHATSAPP_TRANSFORMERS);

                markdownString = markdownString.replace(/\\([*_~`])/g, '$1');

                markdownString = markdownString.replace(/&#32;/g, ' ').replace(/&nbsp;/g, ' ');

                if (onChange) {
                    onChange(markdownString);
                }
            });
        };

        return (
            <div ref={ref} className={`wa-editor-root wa-theme-${theme} ${className}`}>
                <LexicalComposer initialConfig={initialConfig}>
                    <div className="wa-editor-inner">
                        <ToolbarPlugin/>
                        <div className="wa-editor-input-wrapper">
                            <RichTextPlugin
                                contentEditable={<ContentEditable className="wa-editor-input" />}
                                placeholder={<div className="wa-editor-placeholder">{placeholder}</div>}
                                ErrorBoundary={LexicalErrorBoundary as React.ComponentType<any>}
                            />
                        </div>
                        <HistoryPlugin/>

                        <OnChangePlugin onChange={handleEditorChange}/>

                        <MarkdownShortcutPlugin transformers={WHATSAPP_TRANSFORMERS}/>

                        <MarkdownUpdatePlugin value={value}/>

                        <AutoCodeBlockPlugin />
                    </div>
                </LexicalComposer>
            </div>
        );
    }
);

WhatsappEditor.displayName = 'WhatsappEditor';