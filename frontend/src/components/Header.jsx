import React from 'react';
import "./Header.css";
import {Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Link } from 'react-router-dom';
export default function Header({searchBox, button}) {
  return (
    <Box className="header">
        <Link to="/" style={{textDecoration:'none'}}>
        <Box className="header-title" display="flex">
            <Typography variant='h4' color="red">X</Typography> <Typography variant='h4' color="white"> Flix</Typography>
        </Box>
        </Link>
        <Box sx={{width:"50%"}}>
        {searchBox}
        </Box>
        <Box >
        {button} 
        </Box>
             
         
    </Box>
  )
}
