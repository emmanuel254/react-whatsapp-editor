import {useCallback, useEffect, useRef, useState} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND} from 'lexical';
import {$setBlocksType} from '@lexical/selection';
import {$createCodeNode, $isCodeNode} from '@lexical/code';
import EmojiPicker, {Theme} from 'emoji-picker-react'; // <-- 1. Import the picker

interface ToolbarPluginProps {
    theme?: 'light' | 'dark';
}

export const ToolbarPlugin = ({theme = 'light'}: ToolbarPluginProps) => {
    const [editor] = useLexicalComposerContext();

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isCode, setIsCode] = useState(false);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const emojiContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiContainerRef.current && !emojiContainerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));

            const anchorNode = selection.anchor.getNode();
            const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
            setIsCode(selection.hasFormat('code') || $isCodeNode(element));
        }
    }, [editor]);

    useEffect(() => {
        return editor.registerUpdateListener(({editorState}) => {
            editorState.read(() => {
                updateToolbar();
            });
        });
    }, [editor, updateToolbar]);

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

    const onEmojiClick = (emojiData: { emoji: string; }) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                selection.insertText(emojiData.emoji);
            }
        });
    };

    return (
        <div className="wa-editor-toolbar" style={{position: 'relative'}}>
            <button
                type="button"
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

            <div
                ref={emojiContainerRef}
            >
                <button
                    type="button"
                    className={`wa-toolbar-btn ${showEmojiPicker ? 'active' : ''}`}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    aria-label="Insert Emoji"
                >
                    😀
                </button>

                {showEmojiPicker && (
                    <div className="wa-emoji-picker-wrapper" style={{left: 0}}>
                        <EmojiPicker
                            onEmojiClick={onEmojiClick}
                            theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT}
                            width={310}
                            height={400}
                        />
                    </div>
                )}
            </div>

        </div>
    );
};