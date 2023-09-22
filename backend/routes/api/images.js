const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { multipleFilesUpload, multipleMulterUpload, retrievePrivateFile } = require("../../awsS3");

const router = express.Router();

router.get(
  '/:spotId',
  async (req, res) => {
    const images = await SpotImage.findAll({where: { spotId: req.params["spotId"] }});
    const imageUrls = images.map(image => retrievePrivateFile(image.key));
    return res.json(imageUrls);
  }
);

router.post(
  '/:spotId',
  multipleMulterUpload("images"),
  async (req, res) => {
    const { spotId } = req.params;
    const keys = await multipleFilesUpload({ files: req.files });
    console.log('keys', keys)
    // const images = await Promise.all(
    //   keys.map(key => SpotImage.create({ key, spotId }))
    // );
    // const imageUrls = images.map(image => retrievePrivateFile(image.key));
    // return res.json(imageUrls);
  }
);
