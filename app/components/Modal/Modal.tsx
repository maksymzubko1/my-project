import { ReactNode, useEffect } from "react";

import Button from "~/components/Button/Button";

interface ActionProps {
  text: string;
  onAction: Function;
  buttonType: "primary" | "secondary" | "destructive";
  isLoading?: boolean;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions: ActionProps[];
  isLoading?: boolean;
}

const Modal = ({
  open,
  onClose,
  children,
  title,
  actions,
  isLoading,
}: ModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [open]);

  return (
    <div
      tabIndex="-1"
      aria-hidden={!open}
      className={`${!open && "hidden"} flex bg-dark-modal overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full`}
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">{children}</div>
          <div className="flex items-center p-4 md:p-5 gap-2 justify-end border-t border-gray-200 rounded-b dark:border-gray-600">
            <Button loading={isLoading} onClick={onClose} variant={"secondary"}>
              Cancel
            </Button>
            {actions.map((action, index) => (
              <Button
                key={index}
                loading={action.isLoading || isLoading}
                onClick={action.onAction}
                variant={action.buttonType}
              >
                {action.text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
