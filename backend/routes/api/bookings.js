const express = require('express');
const { Sequelize, Op, ValidationError, DATEONLY } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { bookingNotFound } = require('../../utils/bookingNotFound');
const { isAuthorizedSpot } = require('../../utils/isAuthorizedSpot');
const { isAuthorizedBooking } = require('../../utils/isAuthorizedBooking');
const { Booking, Spot } = require('../../db/models');
const router = express.Router();


/****************************************************** */
//Get all of the current user's bookings
router.get( '/current', requireAuth, async (req, res) => {
    const userId = req.user.id;

    const getBookingsByCurrUser = await Booking.findAll({
        where: {userId},
        include: {
            model: Spot,
            attributes: {exclude: ['description', 'createdAt', 'updatedAt']},
            include: 'previewImage'
        },
    });

    return res.json(getBookingsByCurrUser)
});


/****************************************************** */
//Edit a booking


/****************************************************** */
//Delete a booking
router.delete ('/:bookingId', bookingNotFound, requireAuth, async (req, res) => {
    const findBooking = await Booking.findByPk(req.params.bookingId);

    const findBookingbyId = await Booking.findOne({
        where: {id: req.params.bookingId},
        include: {model: Spot}
    });

    if (req.user.id !== findBookingbyId.userId){
        return res.status(403).json({message: "Forbidden"})
    }

    const currDateISO = new Date().toISOString();
    const currDateOnly = currDateISO.slice(0,10);

    if (currDateOnly >= findBooking.startDate && currDateOnly <= findBooking.endDate) {
        return res.status(403).json({message: "Bookings that have been started can't be deleted"})
    }

    else {
        await findBooking.destroy();
        return res.json({message: 'Successfully deleted'})
    }
})


module.exports = router;
