import { Editor } from "@tinymce/tinymce-react";

interface TinymceEditorProps {
  name: string;
  error?: string;

  value?: string;
  onChange?: (value: string) => void;
}

export default function TinymceEditor({
  name,
  error,
  value,
  onChange,
}: TinymceEditorProps) {
  return (
    <div>
      <Editor
        apiKey="l7jaff3jrj0vsf061fldyduej7q93wvxgh65dapulh9jt0ry"
        init={{
          resize: false,
          plugins:
            "anchor autolink link lists image code advcode mergetags wordcount",
          toolbar:
            "undo redo | blocks | bold italic strikethrough backcolor | mergetags | link image | align bullist numlist | code ",
          menubar: "edit format",
        }}
        scriptLoading={{ async: true }}
        textareaName={name}
        value={value ?? ""}
        onEditorChange={(value) => onChange?.(value)}
      />
      {error ? (
        <div className="pt-1 text-red-700" id={`${name}-error`}>
          {error}
        </div>
      ) : null}
    </div>
  );
}
