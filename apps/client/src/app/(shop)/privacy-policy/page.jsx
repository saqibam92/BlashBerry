// apps/client/src/app/(shop)/privacy-policy/page.jsx

import { Typography, Container, Box } from "@mui/material";

export default function PrivacyPolicyPage() {
  return (
    <Container maxWidth="md" className="py-12">
      <Typography variant="h3" className="font-bold mb-8">
        Privacy Policy
      </Typography>
      <Box className="space-y-6 text-gray-600">
        <Typography>
          At BlashBerry, we are committed to protecting your privacy and
          ensuring the security of your personal information.
        </Typography>

        <Typography variant="h6" className="font-bold text-gray-900">
          Information We Collect
        </Typography>
        <Typography>
          We collect information you provide directly to us, such as when you
          create an account, make a purchase, or contact us for support. This
          may include your name, email address, phone number, and shipping
          address.
        </Typography>

        <Typography variant="h6" className="font-bold text-gray-900">
          How We Use Your Information
        </Typography>
        <Typography>
          We use the information we collect to process your orders, communicate
          with you about your account and our products, and improve our
          services.
        </Typography>

        <Typography variant="h6" className="font-bold text-gray-900">
          Data Security
        </Typography>
        <Typography>
          We implement appropriate technical and organizational measures to
          protect your personal data against unauthorized access or disclosure.
        </Typography>
      </Box>
    </Container>
  );
}
