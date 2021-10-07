import cookie from 'js-cookie'

export const getAccessToken = () => cookie.get('token') || localStorage.getItem('access_token') || ''
