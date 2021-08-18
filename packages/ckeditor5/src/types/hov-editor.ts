export enum EditorTypes {
  // full editor
  CLASSIC = 'hov-classic-editor',
  // lesser toolbars
  CHECK_IN = 'hov-checkin-editor',
  // no toolbars
  MODERN = 'hov-modern-editor',
  COMMENT = 'hov-comment-editor',
}

export type Mentionable = {
  id: string;
  // full profile link including base url
  profileLink: string;
  firstname: string | null;
  lastname: string | null;
  username: string | null;
  avatar: string | null;
  email: string;
};

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  mentionables?: Mentionable[];
  disabled?: boolean;
}

interface FullEditor {
  editorType: EditorTypes.CLASSIC;
  policy: {
    url: string;
    token: string;
  };
}

interface CheckInEditor {
  editorType: EditorTypes.CHECK_IN;
}

interface ModernEditor {
  editorType: EditorTypes.MODERN;
}

interface CommentEditor {
  editorType: EditorTypes.COMMENT;
  onEscape: () => void;
  onEnter: (content: string) => void;
}

export type HOVEditorProps = EditorProps &
  (FullEditor | CheckInEditor | ModernEditor | CommentEditor);
