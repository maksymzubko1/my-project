import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Editor } from "@tinymce/tinymce-react";

import ToolTip from "~/components/Tooltip/Tooltip";

interface TinymceEditorProps {
  name: string;
  error?: string;

  tooltip?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function TinymceEditor({
  name,
  error,
  value,
  label,
  tooltip,
  onChange,
}: TinymceEditorProps) {
  return (
    <div>
      {label ? <div className={"flex gap-1 items-center"}>
          <label
            htmlFor={"editor"}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
          {tooltip ? <ToolTip tooltip={tooltip}>
              <InfoCircledIcon />
            </ToolTip> : null}
        </div> : null}
      <Editor
        id={"editor"}
        apiKey="l7jaff3jrj0vsf061fldyduej7q93wvxgh65dapulh9jt0ry"
        init={{
          resize: true,
          max_height: 800,
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
