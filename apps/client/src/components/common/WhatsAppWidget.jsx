// File: apps/client/src/components/common/WhatsAppWidget.jsx
"use client";

import { useState } from "react";
import {
  Box,
  Fab,
  IconButton,
  Typography,
  Paper,
  TextField,
  Button,
  Collapse,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

export default function WhatsAppWidget({
  phoneNumber = "8801566002434", // Your WhatsApp number
  message = "Hello, I have a question about a product.",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState(message);

  const handleSend = () => {
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, "_blank");
    setIsOpen(false);
  };

  return (
    <Box sx={{ position: "fixed", bottom: 16, left: 16, zIndex: 100 }}>
      <Collapse in={isOpen}>
        <Paper
          elevation={4}
          sx={{
            width: 300,
            mb: 1,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "primary.main",
              color: "white",
              p: 2,
            }}
          >
            <Typography variant="h6">Chat with us</Typography>
            <IconButton
              onClick={() => setIsOpen(false)}
              size="small"
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Hi! How can we help you today?
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              variant="contained"
              fullWidth
              endIcon={<SendIcon />}
              onClick={handleSend}
              sx={{ mt: 2 }}
            >
              Start Chat
            </Button>
          </Box>
        </Paper>
      </Collapse>
      <Fab
        color="success"
        onClick={() => setIsOpen((prev) => !prev)}
        sx={{
          backgroundColor: "#25D366",
          "&:hover": { backgroundColor: "#128C7E" },
        }}
      >
        {isOpen ? <CloseIcon /> : <WhatsAppIcon />}
      </Fab>
    </Box>
  );
}
