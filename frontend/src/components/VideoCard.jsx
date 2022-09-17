import React from "react";
import {
  Card,
  CardMedia,
  Typography,
} from "@mui/material";

import "./VideoCard.css";

import "./VideoCard.css";
import { useHistory, Link } from "react-router-dom";

export default function VideoCard({ video }) {
  let releaseYear = new Date(video.releaseDate).getFullYear();
  let currentYear = new Date().getFullYear();
  const history = useHistory();
  return (
    <>
      <Link to={"/video/" + video._id}>
        <div className="card-container">
          <Card className="card">
            <CardMedia
              component="img"
              height={153}
              width={276}
              image={video.previewImage}
            />
          </Card>
          <Typography color="white">{video.title}</Typography>
          <Typography color="GrayText">
            {currentYear - releaseYear} years ago
          </Typography>
        </div>
      </Link>
    </>
  );
}
