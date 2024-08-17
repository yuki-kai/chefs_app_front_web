import { Box, Button, Modal } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css";

type Props = {
  isModalOpen: boolean,
  targetImage: string,
  setIsModalOpen: Dispatch<SetStateAction<boolean>>,
  onCropComplete: (croppedImageUrl: string, data: string) => void
};

export const CropperDialog = ({ isModalOpen, targetImage, setIsModalOpen, onCropComplete }: Props) => {
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    x: 0,
    y: 0,
    width: 200,
    height: 200
})
const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  const handleClose = (setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    setIsModalOpen(false);
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
      const base64Image = canvas.toDataURL("image/png");

      onCropComplete(croppedImageUrl, base64Image);
      setIsModalOpen(false);
    }, "image/png");
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
      open={isModalOpen}
      onClose={() => handleClose(setIsModalOpen)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <ReactCrop
          crop={crop}
          aspect={1}
          onChange={c => setCrop(c)}
        >
          <img src={targetImage} onLoad={(e) => setImageRef(e.currentTarget)} />
        </ReactCrop>
        <Button color="primary" variant="contained" size="medium" onClick={cropImage}>切り取る</Button>
      </Box>
    </Modal>
  );
};
  