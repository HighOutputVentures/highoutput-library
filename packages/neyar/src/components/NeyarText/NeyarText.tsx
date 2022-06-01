import React, { FC, useEffect, useRef, useState } from 'react';

interface NeyarTextProps {
  data: string;
  readOnly?: boolean;
  onKeyUp?(): void;
  blockIndex: number;
}

const NeyarText: FC<NeyarTextProps> = ({ data, readOnly, blockIndex }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isMentionPressed, setMentionPressed] = useState<boolean>(false);
  const [postionOffset, setPositionOffset] = useState<{ x: number; y: number }>(
    { x: 0, y: 0 }
  );

  useEffect(() => {
    const handleClickOutside = (event?: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMentionPressed(false);
        setPositionOffset({ x: 0, y: 0 });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
  }, []);

  const checkPressed = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === '@') {
      const selection = window.getSelection();
      if (selection) {
        let range = selection.getRangeAt(0);
        let span = document.createElement('span');

        let newRange = document.createRange();
        newRange.setStart(selection.focusNode as Node, range.endOffset);

        range.insertNode(span);

        setPositionOffset({
          x: span.offsetLeft,
          y:
            span.offsetTop +
            (wrapperRef.current ? wrapperRef.current.offsetHeight : 0),
        });
        setMentionPressed(true);

        span.remove();
      }
    }
  };

  const onInsertMention = () => {
    document.getElementById(`hov-editor-${blockIndex}`)?.focus();

    let sel, range;
    sel = window.getSelection();

    if (sel) {
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        let el = document.createElement('div');
        el.innerHTML = '<b>INSERTED</b>';
        let frag = document.createDocumentFragment(),
          node,
          lastNode;

        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }

        range.insertNode(frag);

        // Preserve the selection
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
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
        dangerouslySetInnerHTML={{ __html: data }}
        style={{ lineHeight: 1.5, outline: 'none' }}
      />

      <div
        ref={wrapperRef}
        style={{
          display: !isMentionPressed ? 'none' : 'block',
          position: 'absolute',
          left: postionOffset.x,
          right: postionOffset.y,
          width: 300,
          zIndex: 3,
        }}
        onClick={() => {
          setMentionPressed(false);
          setPositionOffset({ x: 0, y: 0 });
        }}
      >
        <button
          style={{
            width: 300,
            height: 30,
            cursor: 'pointer',
            backgroundColor: 'white',
          }}
          onClick={() => {
            onInsertMention();
          }}
        >
          Mention
        </button>
      </div>
    </div>
  );
};

export default NeyarText;
