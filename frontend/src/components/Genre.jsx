import React from "react";
import "./Genre.css";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Button } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import Menu from "@mui/material/Menu";

export default function Genre({
  selectedGenres,
  setSelectedGenres,
  rating,
  setRating,
  sortBy,
  setSortby,
}) {
  

  function handleGenre(e, genres) {
    let selected = [];
    if(genres.includes("All") && e.target.value !== "All"){
      let index = genres.indexOf("All");
        genres.splice(index, 1);
        selected = genres;
    }else if(e.target.value === "All"){
      selected = ["All"];
    }else{
      selected = genres;
    }
    setSelectedGenres(selected);
  }

  

  const genres = [
    { title: "All Genre", value: "All" },
    { title: "Education", value: "Education" },
    { title: "Sports", value: "Sports" },
    { title: "Comedy", value: "Comedy" },
    { title: "Lifestyle", value: "Lifestyle" },
  ];

  const ratings = [
    { title: "Any age group", value: "Anyone" },
    { title: "7+", value: "7%2B" },
    { title: "12+", value: "12%2B" },
    { title: "16+", value: "16%2B" },
    { title: "18+", value: "18%2B" },
  ];

  const sortList = [
    { title: "Release Date", value: "releaseDate" },
    { title: "View Count", value: "viewCount" },
  ];

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (value) => {
    setSortby(value);
    setAnchorEl(null);
  };
  return (
    <div className="container">
      <div className="genre-container">
        <ToggleButtonGroup
          value={selectedGenres}
          onChange={handleGenre}
          aria-label="select genre"
        >
          {genres.map((genre) => {
            return (
              <ToggleButton
                value={genre.value}
                style={{
                  textTransform: "capitalize",
                  margin: "5px",
                  height: "32px",
                  fontSize: "14px",
                  backgroundColor: selectedGenres.includes(genre.value)
                    ? "white"
                    : "black",
                  color: selectedGenres.includes(genre.value)
                    ? "black"
                    : "white",
                }}
                key={genre.value}
              >
                {genre.title}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
        <div>
          <Button
            id="basic-button"
            startIcon={
              <KeyboardDoubleArrowDownIcon></KeyboardDoubleArrowDownIcon>
            }
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            style={{
              backgroundColor: "white",
              color: "black",
              height: "30px",
              width:"6rem",
              borderRadius: "16px",
              textTransform: "capitalize",
            }}
          >
            Sort By
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {sortList.map((list) => {
              return (
                <MenuItem
                style={{backgroundColor:"black", color:"white"}}
                  key={list.value}
                  onClick={() => handleClose(list.value)}
                >
                  {list.value}
                </MenuItem>
              );
            })}
          </Menu>
        </div>
      </div>
      <div className="rating-container">
        {ratings.map((r) => {
          return (
            <Button
              key={r.value}
              style={{
                borderRadius: "16px",
                height: "20px",
                textTransform: "capitalize",
                backgroundColor: r.value === rating ? "white" : "black",
                color: r.value === rating ? "black" : "white",
              }}
              onClick={() => setRating(r.value)}
            >
              {r.title}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
