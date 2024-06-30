import { useFetcher } from "@remix-run/react";

import Input from "~/components/Input/Input";
import Modal from "~/components/Modal/Modal";
import { useToast } from "~/hooks/useToast";

interface ModalProps {
  isOpened: boolean;
  handleClose: () => void;
  initialData: { mixinPerSearch: number; mixinPerList: number } | null;
}

const UpdateMixinModal = ({
  isOpened,
  handleClose,
  initialData,
}: ModalProps) => {
  const fetcher = useFetcher();

  useToast(fetcher.data);

  return (
    <fetcher.Form method={"post"}>
      <Modal
        isLoading={fetcher.state === "loading"}
        open={isOpened}
        onClose={handleClose}
        title={"Update mixin settings"}
        actions={[
          {
            text: "Save",
            onAction: () => {
              console.log("action");
            },
            buttonType: "primary",
            postType: "submit",
          },
        ]}
      >
        <div className="flex flex-col gap-3">
          <Input
            name={"mixinPerList"}
            label={"Mixin per list"}
            placeholder={"Please input number of mixin items per list"}
            inputSettings={{
              required: true,
              min: 0,
              max: 10,
              variant: "input",
              type: "number",
            }}
            id={"intMixinPerList"}
            initialValue={
              initialData ? String(initialData.mixinPerList) : undefined
            }
          />
          <Input
            name={"mixinPerSearch"}
            label={"Mixin per search"}
            placeholder={"Please input number of mixin items per search"}
            inputSettings={{
              required: true,
              min: 0,
              max: 10,
              variant: "input",
              type: "number",
            }}
            id={"mixinPerSearch"}
            initialValue={
              initialData ? String(initialData.mixinPerSearch) : undefined
            }
          />
        </div>
      </Modal>
    </fetcher.Form>
  );
};

export default UpdateMixinModal;
