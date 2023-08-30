import { Editor, EditorProps } from '@monaco-editor/react';

export default function MonacoEditor (props: EditorProps) {
  return (
    <Editor {...props} />
  );
};