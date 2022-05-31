import React, { FC, useEffect, useRef, useState } from 'react';

interface NeyarTextProps {
  data: string;
  readOnly?: boolean;
  onKeyUp?(): void;
  blockIndex: number;
}

const NeyarText: FC<NeyarTextProps> = ({ data, readOnly, blockIndex }) => {
  const wrapperRef = useRef<any>(null);
  const [isMentionPressed, setMentionPressed] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event?: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMentionPressed(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
  }, []);

  const checkPressed = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === '@') {
      setMentionPressed(true);
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
  };

  return (
    <>
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
        }}
        onClick={() => setMentionPressed(false)}
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
    </>
  );
};

export default NeyarText;
