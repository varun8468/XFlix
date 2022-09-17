import { Box, Stack } from "@mui/system";
import React from "react";
import { useParams } from "react-router-dom";
import { config } from "../App";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import Header from "./Header";
import VideoCard from "./VideoCard";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useSnackbar } from "notistack";
import "./Video.css";

export default function Video({ videos, setVideos }) {
  const param = useParams();
  const [video, setVideo] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  let releaseYear = new Date(video.releaseDate).getFullYear();
  let currentYear = new Date().getFullYear();

  async function getVideoById() {
    try {
      if (param.id != null) {
        let res = await axios.get(`${config.endpoint}/video/${param.id}`);
        if (res.status === 200) {
          setVideo(res.data);
        }
      }
    } catch (e) {
      if (e.response) {
        if (e.response.status === 404) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        }
        if (e.response.status === 400) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        }
      }
    }
  }

  async function increaseViewCount(){
    try{
      let res = await axios.patch(`${config.endpoint}/v1/videos/${param.id}/views`);
      
    }catch(e){
      console.log(e.response.data);
    }
  }

  
  useEffect(() => {
    increaseViewCount();
    getVideoById();
  }, []);

  function handleVote(id, vote, change) {
    let obj = {
      vote,
      change,
    };
    changeVote(id, obj);
  }

  async function changeVote(videoId, obj){
    try{
      let res = await axios.patch(`${config.endpoint}/v1/videos/${videoId}/votes`, obj);
    if(res.status === 204){
      getVideoById();
      enqueueSnackbar("Voted successfully", { variant: "success" });
    }
    }catch (e){
      if (e.response.status === 404) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      }
      if (e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      }
    }
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          width: "80%",
          margin: "auto",
        }}
      >
        <Stack mb={7}>
          <div className="iframe-container">
            {(Object.keys(video).length !== 0) ? (
              <iframe
                src={`https://www.${video.videoLink}?autoplay=1`}
                title={video.title}
                width="100%"
                height="523px"
                style={{ border: "none", borderRadius: "10px" }}
                className="iframe-main"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            ) : (
              ""
            )}
            <Stack
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <div style={{ color: "white" }}>{video.title}</div>
              <div className="vote-container">
                <span
                  className="vote-pill upvote-pill"
                  onClick={() => handleVote(video._id, "upVote", "increase")}
                >
                  <ThumbUpIcon style={{ color: "gray" }} />
                  {Object.keys(video).length !== 0 ? (
                    <span color="white">{video.votes.upVotes}</span>
                  ) : (
                    ""
                  )}
                </span>
                <span
                  className="vote-pill downvote-pill"
                  onClick={() => handleVote(video._id, "downVote", "increase")}
                >
                  <ThumbDownIcon style={{ color: "gray" }} />
                  {Object.keys(video).length !== 0 ? (
                    <span color="white">{video.votes.downVotes}</span>
                  ) : (
                    ""
                  )}
                </span>
              </div>
            </Stack>
            <Stack display="flex" direction="row" justifyContent="space-between" width="15%" alignItems="center">
              <Typography style={{ color: "gray" }}>
                {video.contentRating}
              </Typography>
              <div className="circle"></div>
              <Typography style={{ color: "gray" }}>
                {currentYear - releaseYear} years ago
              </Typography>
            </Stack>
          </div>
        </Stack>
        <Stack>
          <Grid container spacing={2}>
            {videos.map((video) => {
              return (
                <Grid item key={video._id} xs={6} md={3}>
                  <VideoCard video={video}></VideoCard>
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </Box>
    </>
  );
}
