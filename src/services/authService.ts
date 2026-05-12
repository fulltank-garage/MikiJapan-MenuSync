import type { LineIdentity } from '../lib/liff'

export type RichMenuSyncResult = {
  status?: 'register' | 'pending' | 'approved' | 'rejected' | string
  richMenu?: 'register' | 'verify' | 'member' | 'rejected' | string
  lineUserId?: string
}

const devApiBaseUrl = 'http://localhost:8080/api'

const getApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/+$/, '')
  }

  if (import.meta.env.DEV) {
    return devApiBaseUrl
  }

  throw new Error('Missing VITE_API_BASE_URL for production build')
}

const getLineHeaders = (lineIdentity?: LineIdentity) => {
  const headers: Record<string, string> = {}

  if (lineIdentity?.lineUserId) {
    headers['X-Line-User-Id'] = lineIdentity.lineUserId
  }
  if (lineIdentity?.lineIdToken) {
    headers['X-Line-ID-Token'] = lineIdentity.lineIdToken
  }
  if (lineIdentity?.lineDisplayName) {
    headers['X-Line-Display-Name'] = lineIdentity.lineDisplayName
  }
  if (lineIdentity?.linePictureUrl) {
    headers['X-Line-Picture-Url'] = lineIdentity.linePictureUrl
  }

  return headers
}

export const syncRichMenu = async (lineIdentity?: LineIdentity) => {
  const response = await fetch(`${getApiBaseUrl()}/auth/rich-menu/sync`, {
    headers: getLineHeaders(lineIdentity),
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(`Rich menu sync request failed: ${response.status}`)
  }

  return response.json() as Promise<RichMenuSyncResult>
}
