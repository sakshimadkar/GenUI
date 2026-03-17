const express = require('express')
const router = express.Router()
const {
  generateComponent,
  getHistory,
  deleteComponent,
  toggleFavorite,
  togglePublic,
  shareComponent,
  getSharedComponent,
  getCommunity,
  forkComponent,
  getStats
} = require('../controllers/componentController')
const { protect } = require('../middleware/authMiddleware')

router.post('/generate', protect, generateComponent)
router.get('/history', protect, getHistory)
router.delete('/:id', protect, deleteComponent)
router.patch('/:id/favorite', protect, toggleFavorite)
router.patch('/:id/public', protect, togglePublic)
router.post('/:id/share', protect, shareComponent)
router.get('/share/:shareId', getSharedComponent)
router.get('/community', getCommunity)
router.post('/:id/fork', protect, forkComponent)
router.get('/stats', getStats)

module.exports = router