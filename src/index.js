const express = require("express");
const fs = require('fs');

const jsonData = []

const jsonString = JSON.stringify(jsonData); 
const filePath = 'student.json';

fs.writeFile(filePath, jsonString, 'utf8', (err) => {
  if (err) {
    console.error('Error writing to file:', err);
  } else {
    console.log('File has been written successfully!');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading from file:', err);
      } else {
        const readData = JSON.parse(data);
        console.log('Read data:', readData);
      }
    });
  }
});
