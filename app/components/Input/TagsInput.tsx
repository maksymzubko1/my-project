import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import HiddenInput from "~/components/Input/HiddenInput";

interface TagsInputProps {
  error?: string;
  name: string;
  id: string;
  initialValue?: { tag: { name: string } }[];
  fullWidth?: boolean;
  label?: string;
}

interface TagId {
  id: number;
  tag: string;
}

const TagsInput = ({ error, name, id, initialValue, fullWidth, label }: TagsInputProps) => {
  const [tags, setTags] = useState<TagId[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [lastId, setLastId] = useState<number>(0);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleTagRemove = useCallback((e, id: number) => {
    setTags(prev => prev.filter(tag => tag.id !== id));
  }, []);

  const handleTagAdd = useCallback((e) => {
    const newTag = inputValue.trim();
    if (newTag !== "") {
      const id = lastId + 1;
      setLastId(id);
      setTags(prev => [...prev, { id: id, tag: newTag }]);
      setInputValue("");
    }
  }, [inputValue, lastId]);

  useEffect(() => {
    if (initialValue && !error) {
      let id = lastId;
      setTags(initialValue.map(tagObject => ({ id: id++, tag: tagObject.tag.name })));
      setLastId(id);
    }
  }, [initialValue, error]);

  return (
    <div className={`${fullWidth ? "w-full " : ""}flex flex-col gap-1`}>
      <HiddenInput name={name} value={tags.map(tag=>tag.tag).join(",")} />
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>}
      <div className="tags-input flex-1 rounded-md text-lg">
        <ul className="tags-list flex gap-2 flex-wrap items-center">
          {tags.map((tag, index) => (
            <li key={index} className="tag px-2 py-1 bg-blue-200 rounded-md flex gap-2">
              {tag.tag}
              <button
                type={"button"}
                className="tag-remove ms-3 transition-all hover:text-red-700"
                onClick={(event) => handleTagRemove(event, tag.id)}>
                &#x2715;
              </button>
            </li>
          ))}
          <li className="flex gap-2 tag-input rounded-md border border-gray-500 px-2 py-1 text-lg">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className={"focus:outline-none"}
              placeholder="Add tags..."
            />
            <button type={"button"} className="transtion-all hover:text-blue-500" onClick={handleTagAdd}>&#43;</button>
          </li>
        </ul>
      </div>
      {error && (
        <div className="pt-1 text-red-700" id={`${name}-error`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default TagsInput;