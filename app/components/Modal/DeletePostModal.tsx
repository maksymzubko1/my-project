import Modal from "~/components/Modal/Modal";

interface ModalProps {
  isLoading: boolean;
  isOpened: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
}

const DeletePostModal = ({
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
      title={"Delete post"}
      actions={[
        {
          text: "Delete",
          onAction: handleSubmit,
          buttonType: "destructive",
        },
      ]}
    >
      <p>
        Are you sure you want to delete this post? This action cannot be undone.
      </p>
    </Modal>
  );
};

export default DeletePostModal;
