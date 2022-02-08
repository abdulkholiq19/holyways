const express = require('express')

const router = express.Router()

const { register, login, checkAuth } = require('../controllers/auth')
const { getUsers, getUser, deleteUser, updateUser } = require('../controllers/user')
const { getProfile, addProfile, updateProfile } = require("../controllers/profile");
const { getFunds, getFundByUser, addFund, updateFund, getFund, deleteFund, updateFundByUserDonate } = require('../controllers/fund')
const { getDonations, getDonation, getDonationByUser, addDonation, updateDonation } = require('../controllers/donation');

const { auth } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/uploadFile');

router.post('/register', register)
router.post('/login', login)
router.get("/check-auth", auth, checkAuth);

router.get('/users', getUsers)
router.patch('/user',auth, updateUser)
router.get('/user/:id', getUser)
router.delete('/user/:id', deleteUser)

router.get("/profile", auth, getProfile);
router.post('/profile', auth, uploadFile('image'), addProfile)
router.patch('/profile', auth, uploadFile('image'), updateProfile)

router.post('/fund', auth, uploadFile('thumbnail'), addFund)
router.patch('/fund/:id', auth, uploadFile('thumbnail'), updateFund)
router.patch('/fund/:id/:idUser', auth, uploadFile('thumbnail'), updateFundByUserDonate)
router.get('/funds', getFunds)
router.get('/fund/:id', getFund)
router.get('/fund-user/:idUser', getFundByUser)
router.delete('/fund/:id',auth,  deleteFund)

router.get('/donations', getDonations)
router.get('/donation/:id', getDonation)
router.get('/donation-user/:idUser', auth, getDonationByUser)
router.post('/donation',auth, uploadFile('proofAttachment'), addDonation)
router.patch('/donation/:id',auth, uploadFile('proofAttachment'), updateDonation)

module.exports = router