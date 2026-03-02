import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { KEY_DOWN_COMMAND, COMMAND_PRIORITY_HIGH, $getSelection, $isRangeSelection } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createCodeNode } from '@lexical/code';

export const AutoCodeBlockPlugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            KEY_DOWN_COMMAND,
            (event: KeyboardEvent) => {
                if (event.key === '`') {
                    let handled = false;

                    editor.update(() => {
                        const selection = $getSelection();
                        if ($isRangeSelection(selection) && selection.isCollapsed()) {
                            const node = selection.anchor.getNode();
                            const parent = node.getParent();

                            if (parent && parent.getType() === 'paragraph' && parent.getTextContent() === '``') {

                                event.preventDefault();
                                parent.clear();

                                $setBlocksType(selection, () => $createCodeNode());
                                handled = true;
                            }
                        }
                    });

                    return handled;
                }
                return false;
            },
            COMMAND_PRIORITY_HIGH
        );
    }, [editor]);

    return null;
};