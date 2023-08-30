import { Editor, EditorProps } from 'react-draft-wysiwyg';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default function WysiwygEditor (props: EditorProps) {
  return (
    <Editor {...props} />
  );
};