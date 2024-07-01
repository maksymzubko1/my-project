import { InfoCircledIcon } from "@radix-ui/react-icons";
import React, { ChangeEvent, useCallback, useState } from "react";

import ToolTip from "~/components/Tooltip/Tooltip";

interface FileUploadProps {
  label?: string;
  initialValue?: string;
  error?: string;
  name: string;
  placeholder?: string;
  id: string;
  fullWidth?: boolean;
  value?: string;
  onChange?: (value: File | null) => void;
  tooltip?: string;
}

function getImage(image: File | string) {
  if (image instanceof File) {
    return URL.createObjectURL(image);
  } else return image;
}

const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  label,
  fullWidth,
  id,
  name,
  initialValue,
  error,
  placeholder,
  tooltip,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialValue ? getImage(initialValue) : null,
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files ? e.target?.files[0] : null;
      if (selectedFile) {
        onChange?.(selectedFile);
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
      } else {
        setPreviewUrl(null);
      }
    },
    [onChange],
  );

  const handleRemoveFile = () => {
    onChange?.(null);
    setPreviewUrl(null);
  };

  return (
    <div className="file-upload">
      {label ? (
        <div className={"flex gap-1 items-center"}>
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
          {tooltip ? (
            <ToolTip tooltip={tooltip}>
              <InfoCircledIcon />
            </ToolTip>
          ) : null}
        </div>
      ) : null}
      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        name={name}
        onChange={handleFileChange}
        aria-invalid={!!error}
        placeholder={placeholder}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`block cursor-pointer ${fullWidth ? "w-full " : ""}text-sm transition-all text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-500 file:text-sm file:font-semibold file:bg-transparent file:text-blue-700 hover:file:bg-blue-100`}
      />
      {typeof previewUrl === "string" || typeof value === "string" ? (
        <div className="image-preview mt-4 relative w-fit">
          <img
            src={
              typeof previewUrl === "string"
                ? previewUrl
                : typeof value === "string"
                  ? value
                  : ""
            }
            alt="Preview"
            className="w-32 h-32 object-cover rounded-md shadow-md"
          />
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute top-1 right-1 text-red-700 bg-white p-1 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-trash"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
            </svg>
          </button>
        </div>
      ) : null}
      {error ? (
        <div className="pt-1 text-red-700" id={`${name}-error`}>
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default FileUpload;
