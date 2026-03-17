const Component = require('../models/Component')
const { v4: uuidv4 } = require('uuid')
const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

function extractCode(response) {
  const match = response.match(/```(?:html)?\n?([\s\S]*?)```/)
  return match ? match[1].trim() : response.trim()
}

const generateComponent = async (req, res) => {
  try {
    const { prompt, framework } = req.body
    if (!prompt || !framework)
      return res.status(400).json({ message: 'Prompt and framework are required' })

    const result = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert UI/UX designer and senior frontend developer at Apple, Stripe and Linear. You create beautiful, modern, animated and fully responsive UI components.

YOUR DESIGN STYLE:
- Use the color scheme mentioned in the user prompt
- If user says "light" or "white" — use white/light background with colorful accents
- If user says "dark" — use dark background (#0a0a0f) with purple/blue accents
- If no color mentioned — use dark theme (#0a0a0f) with purple (#7c3aed) and blue (#3b82f6) accents
- Glassmorphism: backdrop-filter:blur(20px); rgba backgrounds; subtle borders
- Gradient text: -webkit-background-clip:text; -webkit-text-fill-color:transparent
- Smooth CSS animations (@keyframes) on every element
- Hover effects on every interactive element
- Google Fonts Inter
- Glowing blobs: filter:blur(80px); opacity:0.12; radial-gradient; position:absolute

CONTENT RULES:
- NEVER use Lorem ipsum
- NEVER use placeholder text like "Link 1", "Feature 1", "Card Title"
- ALWAYS use realistic, meaningful content
- ALWAYS include CSS animations

TECHNICAL RULES:
- Return ONLY complete HTML in markdown fenced code blocks
- Single HTML file — all CSS and JS inside
- Never return incomplete code
- Always include Google Fonts link`
        },
        {
          role: 'user',
          content: `Create a stunning UI component for: ${prompt}
Framework: ${framework}

REQUIREMENTS:
- Follow the color scheme from the prompt description
- Glassmorphism cards with backdrop-filter blur
- Smooth CSS animations (@keyframes)
- 3D card tilt effect on mousemove using JavaScript
- Hover effects on every button and card
- Mobile responsive
- Real meaningful content (no placeholders)
- Google Fonts Inter

Return ONLY complete HTML in markdown fenced code blocks.`
        }
      ],
      max_tokens: 8000,
      temperature: 0.8
    })

    const code = extractCode(result.choices[0].message.content)

    const component = await Component.create({
      user: req.user._id,
      prompt,
      framework,
      code
    })

    res.status(201).json({ success: true, component })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

const getHistory = async (req, res) => {
  try {
    const components = await Component.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ success: true, components })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteComponent = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id)
    if (!component) return res.status(404).json({ message: 'Component not found' })
    if (component.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' })
    await component.deleteOne()
    res.json({ success: true, message: 'Component deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const toggleFavorite = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id)
    if (!component) return res.status(404).json({ message: 'Component not found' })
    if (component.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' })
    component.isFavorite = !component.isFavorite
    await component.save()
    res.json({ success: true, isFavorite: component.isFavorite })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const togglePublic = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id)
    if (!component) return res.status(404).json({ message: 'Component not found' })
    if (component.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' })
    component.isPublic = !component.isPublic
    await component.save()
    res.json({ success: true, isPublic: component.isPublic })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const shareComponent = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id)
    if (!component) return res.status(404).json({ message: 'Component not found' })
    if (component.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' })
    if (!component.shareId) {
      component.shareId = uuidv4()
      await component.save()
    }
    res.json({ success: true, shareId: component.shareId })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getSharedComponent = async (req, res) => {
  try {
    const component = await Component.findOne({ shareId: req.params.shareId })
      .populate('user', 'username')
    if (!component) return res.status(404).json({ message: 'Component not found' })
    res.json({ success: true, component })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getCommunity = async (req, res) => {
  try {
    const components = await Component.find({ isPublic: true })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
    res.json({ success: true, components })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const forkComponent = async (req, res) => {
  try {
    const original = await Component.findById(req.params.id)
    if (!original) return res.status(404).json({ message: 'Component not found' })
    const forked = await Component.create({
      user: req.user._id,
      prompt: original.prompt,
      framework: original.framework,
      code: original.code,
      forkedFrom: original._id
    })
    original.forkCount += 1
    await original.save()
    res.status(201).json({ success: true, component: forked })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getStats = async (req, res) => {
  try {
    const User = require('../models/User')
    const totalUsers = await User.countDocuments()
    const totalComponents = await Component.countDocuments()
    const publicComponents = await Component.countDocuments({ isPublic: true })
    res.json({ success: true, stats: { totalUsers, totalComponents, publicComponents } })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  generateComponent, getHistory, deleteComponent, toggleFavorite,
  togglePublic, shareComponent, getSharedComponent, getCommunity,
  forkComponent, getStats
}