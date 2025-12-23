// apps/client/src/app/(shop)/terms-conditions/page.jsx

import { Typography, Container, Box } from "@mui/material";

export default function TermsConditionsPage() {
  return (
    <Container maxWidth="md" className="py-12">
      <Typography variant="h3" className="font-bold mb-8">
        Terms & Conditions
      </Typography>
      <Box className="space-y-6 text-gray-600">
        <Typography>
          Welcome to BlashBerry. By accessing or using our website, you agree to
          be bound by these Terms and Conditions.
        </Typography>

        <Typography variant="h6" className="font-bold text-gray-900">
          1. General
        </Typography>
        <Typography>
          These terms apply to all products and services provided by BlashBerry.
          We reserve the right to update these terms at any time without prior
          notice.
        </Typography>

        <Typography variant="h6" className="font-bold text-gray-900">
          2. Products and Pricing
        </Typography>
        <Typography>
          All products are subject to availability. We make every effort to
          display accurate images and pricing, but errors may occur. We reserve
          the right to cancel orders if an error is found.
        </Typography>

        <Typography variant="h6" className="font-bold text-gray-900">
          3. Intellectual Property
        </Typography>
        <Typography>
          All content on this site, including text, graphics, logos, and images,
          is the property of BlashBerry and is protected by copyright laws.
        </Typography>
      </Box>
    </Container>
  );
}
