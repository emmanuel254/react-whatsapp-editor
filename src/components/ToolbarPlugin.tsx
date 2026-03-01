import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createCodeNode } from '@lexical/code';

export const ToolbarPlugin = () => {
    const [editor] = useLexicalComposerContext();

    const formatText = (format: 'bold' | 'italic' | 'strikethrough') => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    };

    // --- NEW SMART CODE HANDLER ---
    const handleCodeFormatting = () => {
        editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
                const selectedText = selection.getTextContent();

                // Check if the user highlighted across multiple lines
                if (selectedText.includes('\n')) {
                    // Convert the whole area into a multiline Code Block
                    $setBlocksType(selection, () => $createCodeNode());
                } else {
                    // Just format the specifically highlighted words as inline code
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
                }
            }
        });
    };

    return (
        <div className="wa-editor-toolbar">
            <button
                type="button"
                className="wa-toolbar-btn"
                onClick={() => formatText('bold')}
                aria-label="Format Bold"
            >
                <strong>B</strong>
            </button>
            <button
                type="button"
                className="wa-toolbar-btn"
                onClick={() => formatText('italic')}
                aria-label="Format Italics"
            >
                <em>I</em>
            </button>
            <button
                type="button"
                className="wa-toolbar-btn"
                onClick={() => formatText('strikethrough')}
                aria-label="Format Strikethrough"
            >
                <del>S</del>
            </button>

            <button
                type="button"
                className="wa-toolbar-btn"
                onClick={handleCodeFormatting} // <-- Use the smart handler here
                aria-label="Insert Code"
            >
                {`</>`}
            </button>
        </div>
    );
};