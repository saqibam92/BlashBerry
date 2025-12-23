// apps/client/src/app/(shop)/about-us/page.jsx

import { Typography, Container, Grid } from "@mui/material";
import Image from "next/image";

export default function AboutUsPage() {
  return (
    <Container maxWidth="lg" className="py-12">
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h3" className="font-bold mb-6">
            About BlashBerry
          </Typography>
          <Typography className="text-gray-600 mb-6 text-lg leading-relaxed">
            BlashBerry is not just another clothing brand, but an innovative
            brand inspired by the future of fashion and charmed by traditional
            colors, art, and textures.
          </Typography>
          <Typography className="text-gray-600 mb-6 leading-relaxed">
            We believe in creating pieces that resonate with the modern
            individual while paying homage to our rich cultural heritage. Our
            collections are carefully curated to ensure quality, style, and
            comfort.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="relative h-[400px] w-full bg-gray-100 rounded-lg overflow-hidden">
            {/* Placeholder for About Us Image */}
            <div className="flex items-center justify-center h-full text-gray-400">
              <Typography variant="h5">BlashBerry Studio</Typography>
            </div>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}
