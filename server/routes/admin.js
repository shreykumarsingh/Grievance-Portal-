const express = require('express')
const router = express.Router()
const { registerOfficer, getAdminDetails, getOfficerData, deleteOfficer, getDistrictComplaints } = require('../controllers/admin')

router.route('/registerOfficer').post(registerOfficer)
router.route('/').get(getAdminDetails)
router.route('/getOfficerData').get(getOfficerData)
router.route('/getComplaints').get(getDistrictComplaints)
router.route('/deleteOfficer/:id').delete(deleteOfficer)

module.exports = router

