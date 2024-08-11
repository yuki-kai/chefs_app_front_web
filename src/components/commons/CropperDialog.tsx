import { Box, Button, Modal } from "@mui/material";
import React, { createRef, Dispatch, SetStateAction, useRef, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css";

type Props = {
  isOpen: boolean,
  src: string,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  onCropComplete: (croppedImageUrl: string) => void
};

export const CropperDialog = ({ isOpen, src, setIsOpen, onCropComplete }: Props) => {
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    x: 0,
    y: 0,
    width: 200,
    height: 200
})
const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  const handleClose = (setIsOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    setIsOpen(false);
  }

  const cropImage = async () => {
    if (!imageRef) return;
    const canvas = document.createElement("canvas");
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      imageRef,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob(blob => {
      if (!blob) {
        console.error("Canvas is empty");
        return;
      }
      const croppedImageUrl = URL.createObjectURL(blob);
      onCropComplete(croppedImageUrl);
      setIsOpen(false);
    }, "image/jpeg");

    setIsOpen(false);
  }

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  
  return (
    <Modal
      open={isOpen}
      onClose={() => handleClose(setIsOpen)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <ReactCrop
          crop={crop}
          aspect={1}
          onChange={c => setCrop(c)}
        >
          <img src={src} onLoad={(e) => setImageRef(e.currentTarget)}/>
        </ReactCrop>
        <Button color="primary" variant="contained" size="medium" onClick={cropImage}>切り取る</Button>
      </Box>
    </Modal>
  );
};
  