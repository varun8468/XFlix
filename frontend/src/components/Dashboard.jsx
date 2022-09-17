import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Search } from "@mui/icons-material";
import {
  Grid,
  InputAdornment,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { Box, Stack } from "@mui/system";
import { config } from "../App";
import VideoCard from "./VideoCard";
import Header from "./Header";
import Genre from "./Genre";
import CloseIcon from "@mui/icons-material/Close";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from '@mui/x-date-pickers';
import { useHistory } from "react-router-dom";

export default function Dashboard({ videos, setVideos }) {
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState(["All"]);
  const [rating, setRating] = useState("Anyone");
  const [sortby, setSortby] = useState("");
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // form handling
  const [videoLink, setVideoLink] = useState("");
  const [title, setTitle] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [genre, setGenre] = useState("");
  const [contentRating, setContentRating] = useState("");
  const [releaseDate, setReleaseDate] = useState(null);

  const history = useHistory();

  function handleDate(value){
    const options = {
      day: "numeric",
      year: "numeric",
      month: "long",
    };
    let date = new Date(value);
    let formattedDate = date.toLocaleDateString("en-IN", options);
    setReleaseDate(formattedDate)
  }

  const obj = {
    videoLink,
    title,
    genre,
    contentRating,
    releaseDate,
    previewImage
  }

  async function uploadVideo(){
    try{
      let res = await axios.post(`${config.endpoint}/v1/videos`, obj);
      if(res.status === 201){
        enqueueSnackbar("Video uploaded successfully", { variant: "success" });
        setOpen(false);
        history.push("/");
      }
    }catch(e){
      if(e.reponse.status === 400){
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      }
    }
  }


  useEffect(() => {
    getVideosByGenre();
  }, [selectedGenres]);

  useEffect(() => {
    getVideosByRating();
  }, [rating]);

  useEffect(() => {
    getSortedVideos();
  }, [sortby]);

  async function getSortedVideos() {
    if (sortby !== "") {
      try {
        let res = await axios.get(
          `${config.endpoint}/v1/videos?sortBy=${sortby}`
        );
        if (res.status === 200) {
          setVideos(res.data.videos);
        }
      } catch (e) {
        if (e.response) {
          if (e.response.status === 400) {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
          }
        }
      }
    }
  }

  async function getVideosByGenre() {
    let params = selectedGenres.join();
    if (selectedGenres.length !== 0) {
      try {
        let res = await axios.get(
          `${config.endpoint}/v1/videos?genres=${params}`
        );
        if (res.status === 200) {
          setVideos(res.data.videos);
        }
      } catch (e) {
        if (e.response) {
          if (e.response.status === 400) {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
          }
        }
      }
    }
  }

  async function getVideosByRating() {
    try {
      if (rating !== "Anyone") {
        let res = await axios.get(
          `${config.endpoint}/v1/videos?contentRating=${rating}`
        );
        if (res.status === 200) {
          setVideos(res.data.videos);
        }
      }
    } catch (e) {
      if (e.response) {
        if (e.response.status === 400) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        }
      }
    }
  }

  const performSearch = async (text) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/v1/videos?title=${text}`
      );
      setVideos(response.data.videos);
    } catch (e) {
      if (e.response) {
        if (e.response.status === 404) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
          setVideos([]);
        }
        if (e.response.status === 500) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
          setVideos(videos);
        }
      }
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeOut = setTimeout(async () => {
      await performSearch(value);
    }, 500);
    setDebounceTimeout(timeOut);
  };

  const searchBox = () => {
    return (
      <TextField
        className="search"
        fullWidth
        variant="outlined"
        size="small"
        color="secondary"
        sx={{
          input: { color: "white" },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="secondary" />
            </InputAdornment>
          ),
        }}
        onChange={(e) => debounceSearch(e, debounceTimeout)}
        placeholder="Search"
        name="search"
      />
    );
  };

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const button = () => {
    return (
      <Box>
        <Button
          startIcon={<FileUploadIcon />}
          sx={{
            backgroundColor: "#479ff7",
            width: "115px",
            height: "30px",
          }}
          onClick={handleClickOpen}
        >
          Upload
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            <Stack
              display="flex"
              direction="row"
              width="100%"
              alignItems="center"
              justifyContent="space-between"
            >
              <div>
                <h5>Upload Video</h5>
              </div>
              <div>
                <span className="cancel-btn" onClick={handleClose}>
                  <CloseIcon />
                </span>
              </div>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <DialogContentText></DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="videoLink"
              label="Video Link"
              onChange={(e)=>setVideoLink(e.target.value)}
              type="text"
              fullWidth
              helperText="This link will be used to derive the video"
              variant="outlined"
            />
            <TextField
              autoFocus
              margin="dense"
              id="previewImage"
              onChange={(e)=>setPreviewImage(e.target.value)}
              label="Thumbnail Image Link"
              type="text"
              fullWidth
              helperText="This link will be used to preview the thumbnail image"
              variant="outlined"
            />
            <TextField
              autoFocus
              margin="dense"
              onChange={(e)=>setTitle(e.target.value)}
              id="title"
              label="Title"
              type="text"
              fullWidth
              helperText="The title will be the representative text for video"
              variant="outlined"
            />
            <FormControl fullWidth style={{marginBottom:"5px"}}>
              <InputLabel id="genre">Genre</InputLabel>
              <Select
                labelId="genre"
                id="genre"
                value={genre}
                label="Genre"
                onChange={(e) => setGenre(e.target.value)}
                
              >
                <MenuItem value={"All"}>All Genre</MenuItem>
                <MenuItem value={"Education"}>Education</MenuItem>
                <MenuItem value={"Sports"}>Sports</MenuItem>
                <MenuItem value={"Comedy"}>Comedy</MenuItem>
                <MenuItem value={"Lifestyle"}>Lifestyle</MenuItem>
              </Select>
              <FormHelperText>Genre will help in categorizing your videos</FormHelperText>
            </FormControl>
            <FormControl fullWidth style={{marginBottom:"5px"}}>
              <InputLabel id="age">Suitable age group for the clip</InputLabel>
              <Select
                labelId="age"
                id="contentRating"
                value={contentRating}
                label="Suitable age group for the clip"
                onChange={(e) => setContentRating(e.target.value)}
              >
                <MenuItem value={"All"}>Any age group</MenuItem>
                <MenuItem value={"7+"}>7+</MenuItem>
                <MenuItem value={"12+"}>12+</MenuItem>
                <MenuItem value={"16+"}>16+</MenuItem>
                <MenuItem value={"18+"}>18+</MenuItem>
              </Select>
              <FormHelperText>This will be used to filter videos on age group suitability</FormHelperText>
            </FormControl >
              <DatePicker
                label="Release date"
                value={releaseDate}
                onChange={(newValue) => {
                  handleDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <FormHelperText>This will be used to sort videos</FormHelperText>
          </DialogContent>
          <DialogActions>
          <Button 
            style={{backgroundColor:'#EE1520'}}
            onClick={uploadVideo}>Submit
          </Button>
          <Button 
            style={{backgroundColor:'inherit', color:'black'}}
            onClick={handleClose}>Cancel
          </Button>
            
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  return (
    <>
      <Header searchBox={searchBox()} button={button()}></Header>
      <Genre
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        rating={rating}
        setRating={setRating}
        sortby={sortby}
        setSortby={setSortby}
      ></Genre>
      <Box
        sx={{
          width: "80%",
          margin: "auto",
        }}
      >
        <Grid container spacing={2}>
          {videos.map((video) => {
            return (
              <Grid item key={video._id} xs={6} md={3}>
                <VideoCard video={video}></VideoCard>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}
