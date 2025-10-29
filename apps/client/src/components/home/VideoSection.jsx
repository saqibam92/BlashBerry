// File: apps/client/src/components/home/VideoSection.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import axios from "axios";

export default function VideoSection({ video }) {
  const [embedData, setEmbedData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Function to fetch Instagram oEmbed data
  const fetchInstagramEmbed = async (url) => {
    try {
      const response = await axios.get("https://api.instagram.com/oembed", {
        params: { url, maxwidth: 320 },
      });
      return response.data.html;
    } catch (error) {
      console.error("Failed to fetch Instagram oEmbed:", error);
      return null;
    }
  };

  // Function to get embed URL or HTML with no controls
  const getEmbedContent = async (url) => {
    try {
      const urlObj = new URL(url);
      let embedContent = { type: "iframe", url };

      // YouTube
      if (
        urlObj.hostname.includes("youtube.com") ||
        urlObj.hostname.includes("youtu.be")
      ) {
        const videoId =
          urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop();
        embedContent.url = `https://www.youtube.com/embed/${videoId}?controls=0&autoplay=1&mute=1&rel=0`;
        embedContent.thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
      // Facebook
      else if (urlObj.hostname.includes("facebook.com")) {
        embedContent.url = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
          url
        )}&show_text=false`;
      }
      // Instagram
      else if (urlObj.hostname.includes("instagram.com")) {
        const instagramHtml = await fetchInstagramEmbed(url);
        if (instagramHtml) {
          embedContent.type = "html";
          embedContent.html = instagramHtml;
          embedContent.thumbnail =
            instagramHtml.match(/src="([^"]*\/thumbnail[^"]*)"/)?.[1] || null;
        } else {
          embedContent.type = "error";
        }
      } else {
        embedContent.type = "error";
      }

      return embedContent;
    } catch (error) {
      console.error("Invalid video URL:", url, error);
      return { type: "error" };
    }
  };

  // Fetch embed data for the video
  useEffect(() => {
    if (video) {
      getEmbedContent(video.url).then((content) => setEmbedData(content));
    }
  }, [video]);

  // Autoplay when video section is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPlaying(true);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the video section is visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <Box sx={{ my: 8 }} ref={videoRef}>
      {video && embedData ? (
        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {video.title}
          </Typography>
          <Box
            sx={{
              position: "relative",
              paddingBottom: "56.25%", // 16:9 aspect ratio
              height: 0,
              overflow: "hidden",
              backgroundColor: "#000",
            }}
          >
            {!embedData ? (
              <Typography color="text.secondary">Loading...</Typography>
            ) : embedData.type === "error" ? (
              <Typography color="error">Invalid video URL</Typography>
            ) : !isPlaying && embedData.thumbnail ? (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${embedData.thumbnail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  onClick={() => setIsPlaying(true)}
                  sx={{ bgcolor: "rgba(0, 0, 0, 0.5)", color: "white" }}
                >
                  <PlayArrowIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Box>
            ) : embedData.type === "iframe" ? (
              <iframe
                src={embedData.url}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={video.title}
                loading="lazy"
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: embedData.html }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
          </Box>
        </Box>
      ) : (
        <Typography color="text.secondary">No video selected.</Typography>
      )}
    </Box>
  );
}
