import express from 'express';
import { createOffer, acceptOffer, updateOfferStatus, editOffer, getOffer, submitRating, getAllOffers,  } from '../controllers/offerController.js';
import { isAuthenticated } from '../middlewares/authmiddleware.js';

const router = express.Router();

// Create Custom Offer (doctor -> user)
router.post('/creat-offer', isAuthenticated, createOffer);
// Accept Offer (user accepts offer)
router.put('/accept-offer',isAuthenticated, acceptOffer);

// Update User Status (doctor updates user's status)
router.put('/update-status', updateOfferStatus);

// Edit Offer (doctor edits offer details)
router.put('/edit-offer', isAuthenticated,editOffer);

router.get('/get-offer/:offerId', getOffer);

router.get('/get-all-offers', getAllOffers);


router.put("/submit-rating/:offerId", isAuthenticated, submitRating);



export default router;
