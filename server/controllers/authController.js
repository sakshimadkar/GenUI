const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields are required' })

    const userExists = await User.findOne({ $or: [{ email }, { username }] })
    if (userExists)
      return res.status(400).json({ message: 'User already exists' })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({ username, email, password: hashedPassword })

    const token = generateToken(user._id)

    res.cookie('token', token, cookieOptions)

    res.status(201).json({
      success: true,
      user: { id: user._id, username: user.username, email: user.email }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' })

    const token = generateToken(user._id)

    res.cookie('token', token, cookieOptions)

    res.json({
      success: true,
      user: { id: user._id, username: user.username, email: user.email }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  })
  res.json({ success: true, message: 'Logged out' })
}

const getMe = async (req, res) => {
  res.json({ success: true, user: req.user })
}

module.exports = { register, login, logout, getMe }