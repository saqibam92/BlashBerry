// File: apps/client/src/app/(shop)/contact-us/page.jsx

import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import Link from "next/link";

export default function ContactUsPage() {
  return (
    <Container maxWidth="lg" className="py-12">
      <Typography variant="h3" className="font-bold mb-8 text-center">
        Contact Us
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} className="p-8 border border-gray-200 h-full">
            <Typography variant="h5" className="font-semibold mb-6">
              Get in Touch
            </Typography>

            <div className="space-y-4">
              <Box>
                <Typography variant="subtitle1" className="font-bold">
                  Phone
                </Typography>
                <Typography className="text-gray-600">
                  +880 1345304161
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" className="font-bold">
                  Email
                </Typography>
                <Typography className="text-gray-600">
                  info@blashberry.com
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" className="font-bold">
                  Address
                </Typography>
                <Typography className="text-gray-600">
                  House no: 20 ( Rooftop ), Road no: 9.
                  <br />
                  Sector no: 4, Uttara,
                  <br />
                  Dhaka-1230, Bangladesh
                </Typography>
              </Box>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} className="p-8 border border-gray-200 h-full">
            <Typography variant="h5" className="font-semibold mb-6">
              Customer Support
            </Typography>
            <Typography className="text-gray-600 mb-4">
              Have a question about your order or need help with sizing? Our
              team is available Saturday to Thursday, 10:00 AM - 8:00 PM.
            </Typography>
            <Typography className="text-gray-600">
              For immediate assistance, you can also reach us via our social
              media channels or WhatsApp.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
