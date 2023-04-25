const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');

const PartnerImage = require("../models/partnerImages");
const customErrors = require("../utils/customError.js");
const admin = require("../FirebaseInitialization")
const bucket = admin.storage().bucket();
const firebase = require("@firebase/storage")


exports.POST_IMAGE = async (req, res, next) => {
  try {
    const file = req.file;

    const fileUpload = bucket.file(file.originalname);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on('error', (error) => {
      throw error;
    });

    stream.on('finish', async () => {
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.originalname)}?alt=media`;

      const newImg = new PartnerImage({
        image: imageUrl,
      });

      const savedImg = await newImg.save();

      if (!savedImg) {
        throw new customErrors('Failed to read the file', 400);
      }

      res.status(200).json({
        status: 'success',
        data: savedImg,
      });
    });

    stream.end(file.buffer);
  } catch (error) {
    return next(error);
  }
};

exports.GET_IMAGES = async (req, res, next) => {
    try {
      const images = await PartnerImage.find();
  
      res.status(200).json({
        status: 'success',
        data: images,
      });
    } catch (error) {
      return next(error);
    }
  };


exports.DELETE_IMAGE = async (req, res, next) => {
  try {
    const { _id } = req.params;

    const image = await PartnerImage.findByIdAndDelete({ _id });

    if (!image) {
      throw new customErrors('Image not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: 'Deleted Partner Image',
    });
  } catch (error) {
    return next(error);
  }
};