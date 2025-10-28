// apps/client/src/components/checkout/OrderSummary

"use client";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  ListItemAvatar,
  ListItemIcon,
} from "@mui/material";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const OrderSummary = ({ items, total }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Order Summary
      </Typography>
      <List disablePadding>
        {items.map((item) => (
          <ListItem
            key={`${item.product._id}-${item.size}`}
            sx={{ py: 1, px: 0 }}
          >
            <ListItemAvatar>
              <Image src={item.product.images[0]} width={50} height={50} />
            </ListItemAvatar>
            <ListItemText
              primary={item.product.name}
              secondary={`Size: ${item.size} x ${item.quantity}`}
            />
            <Typography variant="body2">
              {formatPrice(item.product.price * item.quantity)}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <ListItem sx={{ py: 1, px: 0 }}>
        <ListItemText primary="Total" />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {formatPrice(total)}
        </Typography>
      </ListItem>
    </Box>
  );
};

export default OrderSummary;
