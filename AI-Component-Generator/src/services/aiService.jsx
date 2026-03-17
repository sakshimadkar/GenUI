import axios from 'axios'

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5000/api',
  withCredentials: true
})

const generateComponent = async (prompt, framework) => {
  try {
    const res = await API.post('/components/generate', { prompt, framework })
    return { success: true, component: res.data.component }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Something went wrong' }
  }
}

const getHistory = async () => {
  try {
    const res = await API.get('/components/history')
    return { success: true, components: res.data.components }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Something went wrong' }
  }
}

const deleteComponent = async (id) => {
  try {
    await API.delete(`/components/${id}`)
    return { success: true }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Something went wrong' }
  }
}

const toggleFavorite = async (id) => {
  try {
    const res = await API.patch(`/components/${id}/favorite`)
    return { success: true, isFavorite: res.data.isFavorite }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Something went wrong' }
  }
}

const togglePublic = async (id) => {
  try {
    const res = await API.patch(`/components/${id}/public`)
    return { success: true, isPublic: res.data.isPublic }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Something went wrong' }
  }
}

const shareComponent = async (id) => {
  try {
    const res = await API.post(`/components/${id}/share`)
    return { success: true, shareId: res.data.shareId }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Something went wrong' }
  }
}

const getCommunity = async () => {
  try {
    const res = await API.get('/components/community')
    return { success: true, components: res.data.components }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Something went wrong' }
  }
}

const forkComponent = async (id) => {
  try {
    const res = await API.post(`/components/${id}/fork`)
    return { success: true, component: res.data.component }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Something went wrong' }
  }
}

const getSharedComponent = async (shareId) => {
  try {
    const res = await API.get(`/components/share/${shareId}`)
    return { success: true, component: res.data.component }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Something went wrong' }
  }
}

const getStats = async () => {
  try {
    const res = await API.get('/components/stats')
    return { success: true, stats: res.data.stats }
  } catch (error) {
    return { success: false }
  }
}

export default {
  generateComponent,
  getHistory,
  deleteComponent,
  toggleFavorite,
  togglePublic,
  shareComponent,
  getCommunity,
  forkComponent,
  getSharedComponent,
  getStats
}