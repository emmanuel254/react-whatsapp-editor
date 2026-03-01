// src/components/AutoCodeBlockPlugin.tsx
import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { KEY_DOWN_COMMAND, COMMAND_PRIORITY_HIGH, $getSelection, $isRangeSelection } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createCodeNode } from '@lexical/code';

export const AutoCodeBlockPlugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        // We listen directly to the keyboard with HIGH priority to beat the Markdown plugin
        return editor.registerCommand(
            KEY_DOWN_COMMAND,
            (event: KeyboardEvent) => {
                // If the user presses the backtick key...
                if (event.key === '`') {
                    let handled = false;

                    editor.update(() => {
                        const selection = $getSelection();
                        if ($isRangeSelection(selection) && selection.isCollapsed()) {
                            const node = selection.anchor.getNode();
                            const parent = node.getParent();

                            // If the entire line is exactly two backticks right now...
                            if (parent && parent.getType() === 'paragraph' && parent.getTextContent() === '``') {

                                event.preventDefault(); // 1. Stop the 3rd backtick from typing normally
                                parent.clear();         // 2. Delete the first two backticks

                                // 3. Instantly transform the empty line into a Code Block!
                                $setBlocksType(selection, () => $createCodeNode());
                                handled = true;
                            }
                        }
                    });

                    return handled; // If true, Lexical stops processing other plugins for this keystroke
                }
                return false;
            },
            COMMAND_PRIORITY_HIGH
        );
    }, [editor]);

    return null;
};