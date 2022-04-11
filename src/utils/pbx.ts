import axios from 'axios'

import {
  PBX_OPERATOR_URL,
  PBX_OPERATOR_USER,
  PBX_OPERATOR_PASSWORD,
  CENTRAL_API_URL,
  CENTRAL_API_USER,
  CENTRAL_API_PASSWORD,
  IPBX_API_URL
} from '~/config'
import cache from '~/config/cache'

interface PbxDetail {
  hostname: string
  configDatabase: {
    name: string
    host: string
  }
}

interface AuthInfo {
  accessToken: string
  expiresIn: number
}

interface CallData {
  number: string
  callerId: string
  inRouteExtenId: number
  outRoutingId: number
}

const fetchPbxDetail = async (pbxId: number): Promise<PbxDetail> => {
  const response: { data: PbxDetail } = await axios({
    url: `${PBX_OPERATOR_URL}/pbx/${pbxId}`,
    auth: {
      username: PBX_OPERATOR_USER,
      password: PBX_OPERATOR_PASSWORD
    }
  })

  return response.data
}

const getPbxDetail = async (pbxId: number): Promise<PbxDetail> => {
  let pbxDetail = cache.get('PBX_' + pbxId) as PbxDetail | undefined

  if (pbxDetail) {
    return pbxDetail
  } else {
    pbxDetail = await fetchPbxDetail(pbxId)
    cache.set('PBX_' + pbxId, pbxDetail)
    return pbxDetail
  }
}

const fetchToken = async (): Promise<AuthInfo> => {
  const response = await axios({
    url: `${CENTRAL_API_URL}/v1/sso/login`,
    method: 'POST',
    data: {
      email: CENTRAL_API_USER,
      password: CENTRAL_API_PASSWORD
    }
  })

  return response.data
}

const getToken = async (): Promise<string> => {
  const authToken = cache.get('authToken') as string | undefined

  if (authToken) {
    return authToken
  } else {
    const auth = await fetchToken()
    cache.set('authToken', auth.accessToken, auth.expiresIn - 60)
    return auth.accessToken
  }
}

const makeCall = async (pbxId: string, callData: CallData) => {
  const token = await getToken()
  return axios({
    url: `${IPBX_API_URL}/calls?pbxId=${pbxId}`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: {
      to: callData.number,
      callerId: callData.callerId,
      fromApplication: {
        extenId: callData.inRouteExtenId,
        outRouteId: callData.outRoutingId
      }
    }
  })
}

export { getPbxDetail, makeCall }
