import React, { FC, useEffect, useRef, useState } from 'react';

import { Mention } from '../../../types/types';

interface NeyarTextProps {
  data: string;
  readOnly?: boolean;
  onKeyUp?(): void;
  blockIndex: number;
  mentions?: Mention[];
}

const NeyarText: FC<NeyarTextProps> = ({
  data,
  readOnly,
  blockIndex,
  mentions,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isMentionPressed, setMentionPressed] = useState<boolean>(false);
  const [searchMention, setSearchMention] = useState<string>('');

  console.log(searchMention);

  /** search offset */
  const [startOffset, setStartOffset] = useState<number>(0);
  const [endOffset, setEndOffset] = useState<number>(0);

  /** mention div position */
  const [postionOffset, setPositionOffset] = useState<{ x: number; y: number }>(
    { x: 0, y: 0 }
  );

  useEffect(() => {
    /** close mention div if click outside of it */
    const handleClickOutside = (event?: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMentionPressed(false);
        setPositionOffset({ x: 0, y: 0 });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
  }, []);

  const checkPressed = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keySelectionOffset =
      event.view.document.getSelection()?.focusOffset || 0;

    setEndOffset(keySelectionOffset);

    if (event.key === '@') {
      const selection = window.getSelection();

      if (selection) {
        setStartOffset(keySelectionOffset);
        let range = selection.getRangeAt(0);
        let span = document.createElement('span');

        let newRange = document.createRange();
        newRange.setStart(selection.focusNode as Node, range.endOffset);

        range.insertNode(span);

        setPositionOffset({
          x: span.offsetLeft,
          y: span.offsetTop + 25,
        });

        span.remove();

        setMentionPressed(true);
      }
    }
  };

  const getTextContent = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const start = startOffset + 1;
    const end = endOffset + 1;
    const textContent = event.view.document.getSelection()?.focusNode
      ?.textContent;

    const searchText = textContent?.substring(start, end) || '';

    if (isMentionPressed && !textContent) {
      setMentionPressed(false);
      setStartOffset(0);
    }

    if (isMentionPressed && start > end) {
      setMentionPressed(false);
      setStartOffset(0);
    }

    setSearchMention(searchText);
  };

  const onInsertMention = (mention: Mention) => {
    const editor = document.getElementById(`hov-editor-${blockIndex}`);
    editor?.focus();

    let sel, range;
    sel = window.getSelection();

    if (sel) {
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        let el = document.createElement('div');
        el.innerHTML = `<a href="#" data-mention="${mention.label}">${mention.label}</a>`;
        let frag = document.createDocumentFragment(),
          node,
          lastNode;

        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }

        range.insertNode(frag);

        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }

        // not final
        editor?.childNodes.forEach(node => {
          if (
            node &&
            node.nodeName === '#text' &&
            node.nodeValue
              ?.toLowerCase()
              ?.includes(`@${searchMention.toLowerCase()}`)
          ) {
            node.nodeValue = node.nodeValue.replace(`@${searchMention}`, '');
          }
        });
      }
    }

    setMentionPressed(false);
    setPositionOffset({ x: 0, y: 0 });
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        id={`hov-editor-${blockIndex}`}
        contentEditable={!readOnly}
        onKeyDown={checkPressed}
        onKeyUp={getTextContent}
        dangerouslySetInnerHTML={{ __html: data }}
        style={{ lineHeight: 1.5, outline: 'none' }}
      />

      {Boolean(mentions?.length) && (
        <div
          ref={wrapperRef}
          style={{
            display: !isMentionPressed ? 'none' : 'block',
            position: 'absolute',
            left: postionOffset.x,
            top: postionOffset.y,
            width: 300,
            zIndex: 3,
          }}
          onClick={() => {
            setMentionPressed(false);
            setPositionOffset({ x: 0, y: 0 });
          }}
        >
          {mentions
            ?.filter(mention =>
              isMentionPressed && searchMention
                ? mention.label
                    .toLowerCase()
                    .includes(searchMention.toLowerCase())
                : true
            )
            .map((mention, index) => (
              <button
                key={mention.value}
                style={{
                  width: 250,
                  height: 55,
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid',
                  borderTop: index === 0 ? '1px solid' : '0px',
                }}
                onClick={() => onInsertMention(mention)}
              >
                {mention.avatar && (
                  <img
                    src={mention.avatar}
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 180,
                      marginRight: 20,
                    }}
                  />
                )}{' '}
                {mention.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default NeyarText;
