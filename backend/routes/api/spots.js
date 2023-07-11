const express = require('express');
const { Sequelize, Op, ValidationError } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Spot, User } = require('../../db/models');
const user = require('../../db/models/user');
const router = express.Router();


// const validateSpotCreation = [
//     check('address')
//         .exists({ checkFalsy: true})
//         .isLength({ min: 5 })
//         .isString()
//         .withMessage('The address provided must be at least 5 characters long'),
//     check('city')
//         .exists({ checkFalsy: true})
//         .isLength({ min: 2 })
//         .isString()
//         .withMessage('The city provided must be at least 2 characters long'),
//     check('state')
//         .exists({ checkFalsy: true})
//         .isLength({ min: 2 })
//         .isString()
//         .withMessage('The state provided must be at least 2 characters long'),
//     check('country')
//         .exists({ checkFalsy: true})
//         .isLength({ min: 2 })
//         .isString()
//         .withMessage('The country provided must be at least 2 characters long'),
//     check('lat')
//         .exists({ checkFalsy: true})
//         .isInt()
//         .withMessage('The input for latitude must be in number form'),
//     check('lng')
//         .exists({ checkFalsy: true})
//         .isInt()
//         .withMessage('The input for longitude must be in number form'),
//     check('name')
//         .exists({ checkFalsy: true})
//         .isLength({ min: 2})
//         .isString()
//         .withMessage('The name provided must be at least 2 characters long'),
//     check('description')
//         .exists({ checkFalsy: true})
//         .isLength({ min: 2})
//         .isString()
//         .withMessage('The description provided must be at least 2 characters long'),
//     check('price')
//         .exists({ checkFalsy: true})
//         .isInt()
//         .withMessage('The input for price must be in number form'),
//     handleValidationErrors
//   ];






//get all spots
router.get('/', async (req, res) => {
    const getAllSpots = await Spot.findAll();
    return res.json(getAllSpots)
})



//create a spot
router.post('/', requireAuth, handleValidationErrors, async (req, res, next) => {
    const { address, city, state,
            country, lat, lng,
            name, description, price } = req.body;


    let ownerId = req.user.id;


    try {
        const createSpot = await Spot.create({
            ownerId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        });

        return res.status(201).json(createSpot)

    } catch (error) {
        error.status = 400;
        next (error);
    }
});



module.exports = router;
