import express from 'express';
import { createOffer, acceptOffer, updateOfferStatus, editOffer, getOffer, submitRating,  getOffers, rejectOffer,  } from '../controllers/offerController.js';
import { isAuthenticated } from '../middlewares/authmiddleware.js';

const router = express.Router();

// Create Custom Offer (doctor -> user)
router.post('/creat-offer', isAuthenticated, createOffer);
// Accept Offer (user accepts offer)
router.put('/accept-offer', acceptOffer);
router.put('/reject-offer', rejectOffer);



// Edit Offer (doctor edits offer details)
router.put('/edit-offer', isAuthenticated,editOffer);

router.get('/get-offer/:offerId', getOffer);

router.get("/doctor-offers", isAuthenticated, getOffers);
router.put("/update-status", isAuthenticated, updateOfferStatus);


router.put("/submit-rating/:offerId",  submitRating);



export default router;
