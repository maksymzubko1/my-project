import { useCallback, useState } from "react";

interface Props {
  initialState?: boolean;
}

const useModal = ({ initialState }: Props) => {
  const [open, setOpen] = useState(initialState ?? false);

  const onChange = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return { isOpened: open, handleToggleModal: onChange };
};

export default useModal;
