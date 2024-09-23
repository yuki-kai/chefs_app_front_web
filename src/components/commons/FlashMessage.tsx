"use client";

import { Severity } from "@/types/severity.type";
import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState, FC } from "react";
import { useCookies } from "next-client-cookies";

type Props = {
  messageSeverity: Severity;
  message: string;
};

export const FlashMessage: FC<Props> = (props: Props) => {
  const { messageSeverity, message } = { ...props };
  const cookies = useCookies();
  const defaultDuration = 3000;
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // フラッシュメッセージ表示条件のcookieを削除
    setTimeout(() => {
      cookies.remove(messageSeverity);
    }, 1000)
  }, [])

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={defaultDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        severity={ messageSeverity }
        sx={{ width: '360px' }}
        onClose={handleClose}
      >
        { message }
      </Alert>
    </Snackbar>
  );
};
