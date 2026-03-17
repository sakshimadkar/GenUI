import axios from 'axios'

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5000/api',
  withCredentials: true
})

const register = async (data) => {
  try {
    const res = await API.post('/auth/register', data)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return { success: true, user: res.data.user }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Something went wrong' }
  }
}

const login = async (data) => {
  try {
    const res = await API.post('/auth/login', data)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return { success: true, user: res.data.user }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Something went wrong' }
  }
}

const logout = async () => {
  try {
    await API.post('/auth/logout')
  } catch (error) {
    console.error(error)
  } finally {
    localStorage.removeItem('user')
  }
}

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user') || 'null')
}

export default { register, login, logout, getCurrentUser }