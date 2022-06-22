import React, { FC, useEffect, useRef, useState } from 'react';

export interface MentionProps {
  value: string;
  label: string;
  avatar?: string;
}
export interface NeyarTextProps {
  data: string;
  readOnly?: boolean;
  blockIndex: number;
  mentions?: MentionProps[];
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

  const [startOffset, setStartOffset] = useState<number>(0); // search range start offset
  const [endOffset, setEndOffset] = useState<number>(0); // search range end offset

  const [postionOffset, setPositionOffset] = useState<{ x: number; y: number }>(
    { x: 0, y: 0 }
  ); // position of the div of mention

  useEffect(() => {
    const handleClickOutside = (event?: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMentionPressed(false);
        setPositionOffset({ x: 0, y: 0 });
      }
    };

    document.addEventListener('mousedown', handleClickOutside); // close mention div when user click's outside of it
  }, []);

  /**
   * @checkPressed  event handler for pressing mention keyword
   * @getTextContent get the current text content value after typing
   * @onInsertMention insert mention inside html tags
   */

  const checkPressed = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keySelectionOffset =
      event.view.document.getSelection()?.focusOffset || 0; // get current focus offset position

    setEndOffset(keySelectionOffset);

    if (event.key === '@') {
      const selection = window.getSelection(); // get window focus offset position when '@' is pressed

      if (selection) {
        setStartOffset(keySelectionOffset);

        // create a span to determine the x and y position of the current window selection
        let range = selection.getRangeAt(0);
        let span = document.createElement('span');

        let newRange = document.createRange();
        newRange.setStart(selection.focusNode as Node, range.endOffset);

        range.insertNode(span);

        setPositionOffset({
          x: span.offsetLeft,
          y: span.offsetTop + 25,
        });

        // remove the span after getting the x and y position
        span.remove();

        setMentionPressed(true);
      }
    }
  };

  const getTextContent = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const start = startOffset + 1; // get start offset of '@'
    const end = endOffset + 1; // get end offset after typing '@'
    const textContent = event.view.document.getSelection()?.focusNode
      ?.textContent; // get the text of the child node where the current focus selection

    const searchText = textContent?.substring(start, end) || ''; // get only the text string of the after '@'

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

  const onInsertMention = (mention: MentionProps) => {
    const editor = document.getElementById(`hov-editor-${blockIndex}`);
    editor?.focus(); // set the focus in the current block

    let sel, range;
    sel = window.getSelection(); // get current block range selection

    if (sel) {
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        // create a div element and insert a tag link mention
        let el = document.createElement('div');
        el.innerHTML = `<a href="#" data-mention="${mention.label}">${mention.label}</a>`;

        // create a frag document and insert the div as last node
        let frag = document.createDocumentFragment(),
          node,
          lastNode;

        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }

        range.insertNode(frag); // insert frag document in the current selection

        // set the current selection after the inserted frag document
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }

        //  replace current focus node search text with the empty string
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
    <div style={{ position: 'relative' }} data-test="neyar-text-container">
      <div
        id={`hov-editor-${blockIndex}`}
        contentEditable={!readOnly}
        onKeyDown={checkPressed}
        onKeyUp={getTextContent}
        dangerouslySetInnerHTML={{ __html: data }}
        style={{ lineHeight: 1.5, outline: 'none' }}
        data-test="neyar-text-editor"
      />

      {Boolean(mentions?.length) && (
        <div
          data-test="neyar-text-mention-container"
          ref={wrapperRef}
          style={{
            display: !isMentionPressed ? 'none' : 'block',
            position: 'absolute',
            left: postionOffset.x, // div mention position x is set here
            top: postionOffset.y, // div mention position y is set here
            width: 300,
            zIndex: 3,
          }}
          onClick={() => {
            setMentionPressed(false);
            setPositionOffset({ x: 0, y: 0 });
          }}
        >
          {mentions // map mention data with search filter
            ?.filter(mention =>
              isMentionPressed && searchMention
                ? mention.label
                    .toLowerCase()
                    .includes(searchMention.toLowerCase())
                : true
            )
            .map((mention, index) => (
              <button
                data-test="neyar-text-mention-button"
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
                    data-test="neyar-text-mention-avatar"
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
