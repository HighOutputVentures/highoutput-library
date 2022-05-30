import React, { FC, useState } from 'react';

interface NeyarTextProps {
  data: string;
  readOnly?: boolean;
  onKeyUp?(): void;
  blockIndex: number;
}

const NeyarText: FC<NeyarTextProps> = ({ data, readOnly, blockIndex }) => {
  const [isMentionPressed, setMentionPressed] = useState<boolean>(false);

  const checkPressed = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === '@') {
      // const selection = event.view.document.getSelection();
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

        // Range.createContextualFragment() would be useful here but is
        // non-standard and not supported in all browsers (IE9, for one)
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
        style={{
          display: !isMentionPressed ? 'none' : 'block',
          border: 'solid 1px',
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        <button
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
