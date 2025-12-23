// apps/client/src/app/(shop)/delivery-partner/page.jsx

import { Typography, Container, Paper } from "@mui/material";

export default function DeliveryPartnerPage() {
  return (
    <Container maxWidth="md" className="py-12">
      <Typography variant="h3" className="font-bold mb-8 text-center">
        Delivery Information
      </Typography>
      <Paper elevation={0} className="p-8 border border-gray-200">
        <Typography className="text-gray-600 mb-6">
          We have partnered with leading logistics services in Bangladesh to
          ensure your order reaches you safely and on time.
        </Typography>

        <Typography variant="h6" className="font-bold mb-3">
          Delivery Timelines
        </Typography>
        <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
          <li>
            <strong>Inside Dhaka:</strong> 2-3 working days
          </li>
          <li>
            <strong>Outside Dhaka:</strong> 3-5 working days
          </li>
        </ul>

        <Typography variant="h6" className="font-bold mb-3">
          Delivery Charges
        </Typography>
        <Typography className="text-gray-600">
          Delivery charges will be calculated at checkout based on your
          location.
        </Typography>
      </Paper>
    </Container>
  );
}
