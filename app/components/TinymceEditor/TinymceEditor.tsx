import React, { createRef, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinymceEditorProps {
  initialValue?: string;
  name: string;
  error?: string;
}

export default function TinymceEditor({ initialValue, name, error }: TinymceEditorProps) {
  const editorRef = createRef<any>();

  return (
    <div>
      <Editor
        apiKey="l7jaff3jrj0vsf061fldyduej7q93wvxgh65dapulh9jt0ry"
        init={{
          plugins: "anchor autolink link lists image code advcode mergetags wordcount",
          toolbar: "undo redo | blocks | bold italic strikethrough backcolor | mergetags | link image | align bullist numlist | code "
        }}
        textareaName={name}
        initialValue={initialValue ?? ""}
      />
      {error ? (
        <div className="pt-1 text-red-700" id={`${name}-error`}>
          {error}
        </div>
      ) : null}
    </div>
  );
}