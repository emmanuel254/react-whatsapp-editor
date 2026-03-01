import { useEffect, useState, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createCodeNode, $isCodeNode } from '@lexical/code';

export const ToolbarPlugin = () => {
    const [editor] = useLexicalComposerContext();

    // State to track if the current cursor selection has these formats
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isCode, setIsCode] = useState(false);

    // This function reads the cursor position and updates the button states
    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            // Check inline formats
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));

            // Check if we are inside inline code OR a multiline code block
            const anchorNode = selection.anchor.getNode();
            const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();

            setIsCode(selection.hasFormat('code') || $isCodeNode(element));
        }
    }, [editor]);

    // Listen for any changes in the editor (typing, clicking, selecting)
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateToolbar();
            });
        });
    }, [editor, updateToolbar]);

    // Action handlers
    const formatText = (format: 'bold' | 'italic' | 'strikethrough') => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    };

    const handleCodeFormatting = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                if (selection.getTextContent().includes('\n')) {
                    $setBlocksType(selection, () => $createCodeNode());
                } else {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
                }
            }
        });
    };

    return (
        <div className="wa-editor-toolbar">
            <button
                type="button"
                // Dynamically add the 'active' class
                className={`wa-toolbar-btn ${isBold ? 'active' : ''}`}
                onClick={() => formatText('bold')}
                aria-label="Format Bold"
                disabled={isCode}
            >
                <strong>B</strong>
            </button>
            <button
                type="button"
                className={`wa-toolbar-btn ${isItalic ? 'active' : ''}`}
                onClick={() => formatText('italic')}
                aria-label="Format Italics"
                disabled={isCode}
            >
                <em>I</em>
            </button>
            <button
                type="button"
                className={`wa-toolbar-btn ${isStrikethrough ? 'active' : ''}`}
                onClick={() => formatText('strikethrough')}
                aria-label="Format Strikethrough"
                disabled={isCode}
            >
                <del>S</del>
            </button>
            <button
                type="button"
                className={`wa-toolbar-btn ${isCode ? 'active' : ''}`}
                onClick={handleCodeFormatting}
                aria-label="Insert Code"
            >
                {`</>`}
            </button>
        </div>
    );
};