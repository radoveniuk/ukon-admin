'use client';
import ReactJson from 'react-json-view';
import Dialog, { DialogProps } from 'rc-dialog';

type Props = DialogProps & {
  json: { [key: string]: any };
}

export default function JsonDialog({ json, ...props }: Props) {
  return (
    <Dialog title="Json view" {...props}>
      <ReactJson src={json} />
    </Dialog>
  );
}