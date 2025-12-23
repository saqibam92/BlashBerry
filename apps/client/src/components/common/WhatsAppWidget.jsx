// File: apps/client/src/components/common/WhatsAppWidget.jsx
"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Box,
  Fab,
  IconButton,
  Typography,
  Paper,
  TextField,
  Button,
  Collapse,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

// Constants
const INITIAL_X = 16;
const FAB_SIZE = 56; // Standard MUI Fab size
const INITIAL_Y_DESKTOP = 16;
const INITIAL_Y_MOBILE = 90;

export default function WhatsAppWidget({
  phoneNumber = "+8801345304161",
  message = "Hello, I have a question about a product.",
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const initialY = isMobile ? INITIAL_Y_MOBILE : INITIAL_Y_DESKTOP;

  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState(message);
  const [position, setPosition] = useState({ x: INITIAL_X, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const widgetRef = useRef(null);

  // Update position on viewport change (e.g., orientation)
  useEffect(() => {
    setPosition((prev) => ({ x: prev.x, y: initialY }));
  }, [initialY]);

  const handleSend = () => {
    const phone = phoneNumber.startsWith("+")
      ? phoneNumber.substring(1)
      : phoneNumber;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phone}?text=${encodedText}`, "_blank");
    setIsOpen(false);
  };

  // Helper to get coordinates from mouse or touch event
  const getCoords = (e) => {
    if (e.touches && e.touches.length) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return e;
  };

  // --- DRAG HANDLERS ---
  const handleDragStart = useCallback(
    (e) => {
      if (isOpen) return;

      const { clientX, clientY } = getCoords(e);
      e.preventDefault(); // Prevent scrolling on touch devices

      setIsDragging(true);

      // Calculate offset: difference between mouse/touch position and widget's CSS position
      dragOffset.current = {
        x: clientX - position.x,
        y: clientY - (window.innerHeight - position.y - FAB_SIZE), // Convert bottom to top-based offset
      };
    },
    [isOpen, position.x, position.y]
  );

  const handleDragMove = useCallback(
    (e) => {
      if (!isDragging || isOpen) return;

      const { clientX, clientY } = getCoords(e);
      e.preventDefault(); // Prevent scrolling on touch devices

      // Calculate new CSS left/bottom positions
      const newLeft = clientX - dragOffset.current.x;
      const newTop = clientY - dragOffset.current.y; // Temporary top position
      const newBottom = window.innerHeight - newTop - FAB_SIZE; // Convert to bottom

      // Boundary checks
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const minX = INITIAL_X;
      const minY = INITIAL_Y_DESKTOP; // Consistent boundary for physical limits
      const maxX = viewportWidth - FAB_SIZE - INITIAL_X;
      const maxY = viewportHeight - FAB_SIZE - INITIAL_Y_DESKTOP;

      setPosition({
        x: Math.max(minX, Math.min(newLeft, maxX)),
        y: Math.max(minY, Math.min(newBottom, maxY)),
      });
    },
    [isDragging, isOpen]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Set up global event listeners
  useEffect(() => {
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleDragMove, { passive: false });
    document.addEventListener("touchend", handleDragEnd);

    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDragMove);
      document.removeEventListener("touchend", handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  // --- RENDER ---
  return (
    <Box
      ref={widgetRef}
      sx={{
        position: "fixed",
        bottom: position.y, // Use bottom for positioning
        left: position.x,
        transition: isDragging ? "none" : "bottom 0.3s, left 0.3s",
        zIndex: 100,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
    >
      <Collapse in={isOpen}>
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            bottom: FAB_SIZE + 8, // Position chat window above FAB
            left: 0,
            width: 300,
            borderRadius: 2,
            overflow: "hidden",
            pointerEvents: "auto",
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
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        sx={{
          width: FAB_SIZE,
          height: FAB_SIZE,
          touchAction: "none", // Prevent pinch/zoom or other touch actions
          cursor: isDragging ? "grabbing" : "grab",
          backgroundColor: "#25D366",
          "&:hover": { backgroundColor: "#128C7E" },
        }}
      >
        {isOpen ? <CloseIcon /> : <WhatsAppIcon />}
      </Fab>
    </Box>
  );
}

// // File: apps/client/src/components/common/WhatsAppWidget.jsx
// "use client";
// import { useState, useRef, useCallback, useEffect } from "react";
// import {
//   Box,
//   Fab,
//   IconButton,
//   Typography,
//   Paper,
//   TextField,
//   Button,
//   Collapse,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import WhatsAppIcon from "@mui/icons-material/WhatsApp";
// import CloseIcon from "@mui/icons-material/Close";
// import SendIcon from "@mui/icons-material/Send";

// // Constants
// const INITIAL_X = 16;
// const FAB_SIZE = 56; // Standard MUI Fab size
// const INITIAL_Y_DESKTOP = 16;
// const INITIAL_Y_MOBILE = 90;

// export default function WhatsAppWidget({
//   phoneNumber = "+8801345304161",
//   message = "Hello, I have a question about a product.",
// }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const initialY = isMobile ? INITIAL_Y_MOBILE : INITIAL_Y_DESKTOP;

//   const [isOpen, setIsOpen] = useState(false);
//   const [text, setText] = useState(message);
//   // const [position, setPosition] = useState({ x: INITIAL_X, y: initialY });
//   // const [position, setPosition] = useState({ x: INITIAL_X, y: initialY });
//   const [position, setPosition] = useState({ x: INITIAL_X, y: initialY });

//   const [isDragging, setIsDragging] = useState(false);
//   const dragOffset = useRef({ x: 0, y: 0 });
//   const widgetRef = useRef(null);

//   // Update position on viewport change (e.g., orientation)
//   useEffect(() => {
//     setPosition((prev) => ({ x: prev.x, y: initialY }));
//   }, [initialY]);

//   const handleSend = () => {
//     const phone = phoneNumber.startsWith("+")
//       ? phoneNumber.substring(1)
//       : phoneNumber;
//     const encodedText = encodeURIComponent(text);
//     window.open(`https://wa.me/${phone}?text=${encodedText}`, "_blank");
//     setIsOpen(false);
//   };

//   // Helper to get coordinates from mouse or touch event
//   const getCoords = (e) => {
//     if (e.touches && e.touches.length) {
//       return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
//     }
//     return e;
//   };

//   // --- DRAG HANDLERS ---
//   // const handleDragStart = useCallback(
//   //   (e) => {
//   //     if (isOpen) return;

//   //     const { clientX, clientY } = getCoords(e);
//   //     e.preventDefault(); // Prevent scrolling on touch devices

//   //     setIsDragging(true);

//   //     // Calculate offset: difference between mouse/touch position and widget's CSS position
//   //     dragOffset.current = {
//   //       x: clientX - position.x,
//   //       y: clientY - (window.innerHeight - position.y - FAB_SIZE),
//   //     };
//   //   },
//   //   [isOpen, position.x, position.y]
//   // );

//   // const handleDragMove = useCallback(
//   //   (e) => {
//   //     if (!isDragging || isOpen) return;

//   //     const { clientX, clientY } = getCoords(e);

//   //     // Calculate new CSS left/bottom positions
//   //     const newLeft = clientX - dragOffset.current.x;
//   //     const newTop = clientY - dragOffset.current.y;
//   //     const newBottom = window.innerHeight - newTop - FAB_SIZE;

//   //     // Boundary checks
//   //     const viewportWidth = window.innerWidth;
//   //     const viewportHeight = window.innerHeight;
//   //     const minX = INITIAL_X;
//   //     const minY = INITIAL_Y_DESKTOP; // Consistent boundary for physical limits
//   //     const maxX = viewportWidth - FAB_SIZE - INITIAL_X;
//   //     const maxY = viewportHeight - FAB_SIZE - INITIAL_Y_DESKTOP;

//   //     setPosition({
//   //       x: Math.max(minX, Math.min(newLeft, maxX)),
//   //       y: Math.max(minY, Math.min(newBottom, maxY)),
//   //     });
//   //   },
//   //   [isDragging, isOpen]
//   // );

//   const handleDragStart = useCallback(
//     (e) => {
//       if (isOpen) return;

//       const { clientX, clientY } = getCoords(e);

//       setIsDragging(true);

//       dragOffset.current = {
//         x: clientX - position.x,
//         y: clientY - position.y,
//       };
//     },
//     [isOpen, position.x, position.y]
//   );

//   const handleDragMove = useCallback(
//     (e) => {
//       if (!isDragging || isOpen) return;

//       const { clientX, clientY } = getCoords(e);
//       e.preventDefault(); // ⬅ prevents scroll on mobile

//       const newX = clientX - dragOffset.current.x;
//       const newY = clientY - dragOffset.current.y;

//       const maxX = window.innerWidth - FAB_SIZE - 16;
//       const maxY = window.innerHeight - FAB_SIZE - 16;

//       setPosition({
//         x: Math.max(16, Math.min(newX, maxX)),
//         y: Math.max(16, Math.min(newY, maxY)),
//       });
//     },
//     [isDragging, isOpen]
//   );

//   const handleDragEnd = useCallback(() => {
//     setIsDragging(false);
//   }, []);

//   // Set up global event listeners
//   useEffect(() => {
//     document.addEventListener("mousemove", handleDragMove);
//     document.addEventListener("mouseup", handleDragEnd);
//     document.addEventListener("touchmove", handleDragMove, { passive: false });
//     document.addEventListener("touchend", handleDragEnd);

//     return () => {
//       document.removeEventListener("mousemove", handleDragMove);
//       document.removeEventListener("mouseup", handleDragEnd);
//       document.removeEventListener("touchmove", handleDragMove);
//       document.removeEventListener("touchend", handleDragEnd);
//     };
//   }, [handleDragMove, handleDragEnd]);

//   // --- RENDER ---
//   return (
//     <Box
//       ref={widgetRef}
//       sx={{
//         position: "fixed",
//         // bottom: position.y,
//         // left: position.x,
//         top: position.y,
//         left: position.x,
//         transition: isDragging ? "none" : "bottom 0.3s, left 0.3s",
//         zIndex: 100,
//         cursor: isDragging ? "grabbing" : "grab",
//         userSelect: "none",
//       }}
//     >
//       <Collapse in={isOpen}>
//         <Paper
//           elevation={4}
//           sx={{
//             position: "absolute",
//             bottom: FAB_SIZE + 8,
//             left: 0,
//             width: 300,
//             borderRadius: 2,
//             overflow: "hidden",
//             pointerEvents: "auto",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               bgcolor: "primary.main",
//               color: "white",
//               p: 2,
//             }}
//           >
//             <Typography variant="h6">Chat with us</Typography>
//             <IconButton
//               onClick={() => setIsOpen(false)}
//               size="small"
//               sx={{ color: "white" }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </Box>
//           <Box sx={{ p: 2 }}>
//             <Typography variant="body2" sx={{ mb: 2 }}>
//               Hi! How can we help you today?
//             </Typography>
//             <TextField
//               fullWidth
//               multiline
//               rows={3}
//               variant="outlined"
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//             />
//             <Button
//               variant="contained"
//               fullWidth
//               endIcon={<SendIcon />}
//               onClick={handleSend}
//               sx={{ mt: 2 }}
//             >
//               Start Chat
//             </Button>
//           </Box>
//         </Paper>
//       </Collapse>
//       <Fab
//         color="success"
//         onClick={() => setIsOpen((prev) => !prev)}
//         onMouseDown={handleDragStart}
//         onTouchStart={handleDragStart}
//         // sx={{
//         //   width: FAB_SIZE,
//         //   height: FAB_SIZE,
//         //   touchAction: "none",
//         //   cursor: isDragging ? "grabbing" : "grab",
//         //   backgroundColor: "#25D366",
//         //   "&:hover": { backgroundColor: "#128C7E" },
//         // }}
//         sx={{
//           position: "fixed",
//           bottom: `calc(100vh - ${position.y + FAB_SIZE}px)`,
//           left: position.x,
//           transition: isDragging ? "none" : "bottom 0.3s, left 0.3s",
//           zIndex: 100,
//           cursor: isDragging ? "grabbing" : "grab",
//           userSelect: "none",
//         }}
//       >
//         {isOpen ? <CloseIcon /> : <WhatsAppIcon />}
//       </Fab>
//     </Box>
//   );
// }
