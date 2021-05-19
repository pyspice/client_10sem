import * as React from 'react';
import Form from 'react-bootstrap/Form';

export type UploadProps = {
  onChange: (value: string) => void;
  label: React.ReactNode;
};

export function Upload({ onChange, label }: UploadProps) {
  const onChangeFile = ({
    target: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const file = files?.[0];
    if (file === undefined) return;

    var reader = new FileReader();

    reader.onload = (function (_) {
      return function (e: ProgressEvent<FileReader>) {
        onChange(e.target?.result as string);
      };
    })(file);

    reader.readAsText(file);
  };

  return (
    <Form className="w-100 h-100 py-1">
      <Form.Group>
        <Form.Label className="text-center w-100">{label}</Form.Label>
        <Form.File accept="application/json" onChange={onChangeFile} />
      </Form.Group>
    </Form>
  );
}
