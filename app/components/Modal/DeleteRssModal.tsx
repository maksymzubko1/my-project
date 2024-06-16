import Modal from "~/components/Modal/Modal";

interface ModalProps {
  isLoading: boolean;
  isOpened: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
}

const DeleteRSSModal = ({
  isLoading,
  isOpened,
  handleClose,
  handleSubmit,
}: ModalProps) => {
  return (
    <Modal
      isLoading={isLoading}
      open={isOpened}
      onClose={handleClose}
      title={"Delete RSS"}
      actions={[
        {
          text: "Delete",
          onAction: handleSubmit,
          buttonType: "destructive",
        },
      ]}
    >
      <p>
        Are you sure you want to delete this RSS? This action cannot be undone.
      </p>
    </Modal>
  );
};

export default DeleteRSSModal;
