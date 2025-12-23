// apps/client/src/app/(shop)/exchange-return-policy/page.jsx

import { Typography, Container, Paper, Box } from "@mui/material";

export default function ExchangeReturnPolicyPage() {
  return (
    <Container maxWidth="md" className="py-12">
      <Typography variant="h3" className="font-bold mb-8 text-center">
        Our Delivery & Return Policy
      </Typography>

      <Paper elevation={0} className="p-8 border border-gray-200">
        <Typography className="text-gray-600 mb-8">
          To ensure the best shopping experience, please take a moment to review
          our easy return and exchange process:
        </Typography>

        <Box className="space-y-8">
          <div>
            <Typography variant="h6" className="font-bold mb-2">
              Check Upon Delivery
            </Typography>
            <Typography className="text-gray-600">
              Please inspect your items immediately while the delivery person is
              present. For hygiene and safety reasons, we cannot accept returns
              or provide refunds once the delivery person has left.
            </Typography>
          </div>

          <div>
            <Typography variant="h6" className="font-bold mb-2">
              Easy Returns
            </Typography>
            <Typography className="text-gray-600">
              If the product isn’t what you expected or has a defect, you can
              return it on the spot to the delivery person. In this case, only
              the delivery charge will apply.
            </Typography>
          </div>

          <div>
            <Typography variant="h6" className="font-bold mb-2">
              Size Exchanges
            </Typography>
            <Typography className="text-gray-600">
              Not the perfect fit? No worries! For clothing and shoes, please
              inbox us within 24 hours of receipt to request an exchange.
            </Typography>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <Typography className="text-sm font-semibold text-gray-800">
              Note: Exchange charges will apply, and requests made after 24
              hours cannot be accepted.
            </Typography>
          </div>
        </Box>
      </Paper>
    </Container>
  );
}
