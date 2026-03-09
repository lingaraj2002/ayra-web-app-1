import React from "react";
import "./ModalPopup.scss";
import { Box, IconButton, Modal, Slide, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useIsMobile as isMobile } from "../../hooks/useIsMobile";

const Transition = React.forwardRef(function Transition(props, ref) {
  return isMobile() ? (
    <Slide direction="up" ref={ref} {...props} />
  ) : (
    <Fade ref={ref} {...props} />
  );
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "16px",
  bgcolor: "background.paper",
  boxShadow: 24,
};

const ModalPopup = (props) => {
  const { open, handleClose, title, children } = props;

  return (
    <Modal open={open} onClose={handleClose || null}>
      <Transition in={open} timeout={300}>
        <Box
          sx={{
            ...style,
            maxHeight: "100vh",
            overflowY: "auto",
          }}
          className={`modal-popup__main`}
          tabIndex={-1}
        >
          <div className={`modal-popup__head`}>
            <h3>{title}</h3>
            <IconButton onClick={handleClose} className="close-btn">
              <CloseIcon htmlColor="#4258BF" />
            </IconButton>
          </div>
          <div className="modal-popup__body">{children}</div>
        </Box>
      </Transition>
    </Modal>
  );
};

export default ModalPopup;
