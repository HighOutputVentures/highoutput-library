import flattenDeep from 'lodash/flattenDeep';
import nodeEmoji from 'node-emoji';
import {
  Mention,
  S3Upload,
  Video,
  VideoUpload,
} from '@highoutput/custom-ckeditor-build';

import { EditorTypes, Mentionable } from '../types/hov-editor';
import { categories as emojiCategories } from '../constants/emoji.json';

const BASIC_TOOLBARS = [
  'heading',
  '|',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'code',
  '|',
  'bulletedList',
  'numberedList',
];

const EXTRA_TOOLBARS = [
  'blockQuote',
  'codeBlock',
  '|',
  'imageUpload',
  'videoUpload',
  'link',
  '|',
  'horizontalLine',
  'undo',
  'redo',
];

export const getToolbars = (type: EditorTypes) => {
  switch (type) {
    case EditorTypes.CLASSIC:
      return [...BASIC_TOOLBARS, ...EXTRA_TOOLBARS];
    case EditorTypes.CHECK_IN:
      return [...BASIC_TOOLBARS, 'link'];
    case EditorTypes.MODERN:
    case EditorTypes.COMMENT:
    default:
      return [];
  }
};

export const getPlugins = (mentionables: Mentionable[], type: EditorTypes) => {
  return [
    Mention,
    MentionToLink(mentionables),
    ...(type === EditorTypes.CLASSIC ? [S3Upload, Video, VideoUpload] : []),
  ];
};

export const getDisplayName = (mentionable: Mentionable) => {
  if (mentionable.firstname && mentionable.lastname) {
    return `${mentionable.firstname} ${mentionable.lastname}`;
  } else if (mentionable.username) {
    return mentionable.username;
  } else {
    return mentionable.email;
  }
};

export const moveCursorToEnd = (editor: any) => {
  editor.model.change((writer: any) => {
    writer.setSelection(
      writer.createPositionAt(editor.model.document.getRoot(), 'end')
    );
  });
};

export const handleEscapeKey = (editor: any, callback?: () => void) => {
  editor.editing.view.document.on(
    'keydown',
    (_: any, data: any) => {
      // keyCode 27 is `Escape`
      if (data.keyCode === 27) {
        callback?.();
        editor.setData('');
      }
    },
    { priority: 'high' }
  );
};

export const handleEnterKey = (
  editor: any,
  callback?: (content: string) => void
) => {
  editor.editing.view.document.on(
    'enter',
    (evt: any, data: any) => {
      if (data.isSoft) {
        editor.execute('shiftEnter');
      } else {
        callback?.(editor.getData());
        editor.setData('');
      }
      data.preventDefault();
      evt.stop();
    },
    { priority: 'high' }
  );
};

export const getEmojiFeed = () => {
  const baseEmojis = emojiCategories.map(e => e.emojis);
  const mergedEmojiList = Array.from(new Set(flattenDeep(baseEmojis))).map(
    e => ({
      id: `:${e}:`,
      emoji: nodeEmoji.emojify(`:${e}:`, () => '😃'),
    })
  );
  return mergedEmojiList;
};

export const emojiItemRenderer = (item: any) => {
  const divElement = document.createElement('div');
  divElement.textContent = `${item.emoji} ${item.id}`;
  return divElement;
};

export const getNameAbbreviation = (mentionable: Mentionable) => {
  return getDisplayName(mentionable)
    .split(' ')
    .map(t => t.charAt(0))
    .join('')
    .toUpperCase();
};

export function mentionItemRenderer(item: any, mentionables: Mentionable[]) {
  const divElement = document.createElement('div');
  divElement.classList.add('mentionable-item');
  divElement.id = `mentionable-item-${item.id}`;

  const imageElement = document.createElement('img');

  const memberDetails = mentionables.find(
    m => `@${getDisplayName(m)}` === item.text
  );

  if (memberDetails?.avatar) {
    imageElement.src = memberDetails.avatar;
    imageElement.classList.add('mentionable-item-avatar');
    divElement.appendChild(imageElement);
  } else {
    const spanElement = document.createElement('span');
    spanElement.classList.add('mentionable-item-avatar');
    spanElement.textContent = memberDetails
      ? getNameAbbreviation(memberDetails)
      : '';
    divElement.appendChild(spanElement);
  }

  const displayNameElement = document.createElement('span');
  displayNameElement.classList.add('mentionable-item-name');
  displayNameElement.textContent = memberDetails
    ? getDisplayName(memberDetails)
    : '';

  divElement.appendChild(displayNameElement);
  return divElement;
}

// CKEditor
// Convert mentions to links
const MentionToLink = (mentionables: Mentionable[]) => {
  return (editor: any) => {
    editor.conversion.for('upcast').elementToAttribute({
      view: {
        name: 'a',
        key: 'data-mention',
        classes: 'mention',
        attributes: {
          href: true,
        },
      },
      model: {
        key: 'mention',
        value: (viewItem: any) => {
          const mentionAttribute = editor.plugins
            .get('Mention')
            .toMentionAttribute(viewItem, {
              // Add any other properties that you need.
              link: viewItem.getAttribute('href'),
              userId: viewItem.getAttribute('data-user-id'),
            });
          return mentionAttribute;
        },
      },
      converterPriority: 'high',
    });
    // Downcast the model 'mention' | 'emoji'
    editor.conversion.for('downcast').attributeToElement({
      model: 'mention',
      view: (modelAttributeValue: any, { writer }: any) => {
        if (!modelAttributeValue) return;
        const memberDetails = mentionables.find(
          m => `@${getDisplayName(m)}` === modelAttributeValue.id
        );
        const isMention =
          memberDetails && Boolean(Object.keys(memberDetails).length);
        return writer.createAttributeElement(
          isMention ? 'a' : 'span',
          {
            class: isMention ? 'mention' : 'emoji',
            ...(isMention && {
              'data-mention': modelAttributeValue.id,
              href: memberDetails?.profileLink,
            }),
          },
          {
            // Make mention attribute to be wrapped by other attribute elements.
            priority: 20,
            // Prevent merging mentions together.
            id: modelAttributeValue.uid,
          }
        );
      },
      converterPriority: 'high',
    });
  };
};
