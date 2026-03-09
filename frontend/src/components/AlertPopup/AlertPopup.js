import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import "./AlertPopup.scss";

const AlertPopup = (props) => {
  const { open, title, message, handleClose } = props;

  return (
    <Dialog open={open} fullWidth maxWidth={"xs"} className="alert-popup-main">
      <div className="alert-popup-main__title">{title}</div>
      <p>{message}</p>
      <div className="alert-popup-main__action">
        <Button variant="contained" onClick={handleClose} autoFocus>
          Got it
        </Button>
      </div>
    </Dialog>
  );
};

export default AlertPopup;
