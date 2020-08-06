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

interface PbxDetail {
  hostname: string
  dbHost: string
}

export async function getPbxDetail(pbxId: number): Promise<PbxDetail> {
  const response: { data: PbxDetail } = await axios({
    url: `${PBX_OPERATOR_URL}/pbx/${pbxId}`,
    auth: {
      username: PBX_OPERATOR_USER,
      password: PBX_OPERATOR_PASSWORD
    }
  })

  return response.data
}

async function getToken(): Promise<string> {
  const response = await axios({
    url: `${CENTRAL_API_URL}/v1/sso/login`,
    method: 'POST',
    data: {
      email: CENTRAL_API_USER,
      password: CENTRAL_API_PASSWORD
    }
  })

  return response.data.accessToken
}

export async function makeCall(pbxId: string, number: string): Promise<string> {
  const token = await getToken()
  const response = await axios({
    url: `${IPBX_API_URL}/calls?pbxId=${pbxId}`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: {
      to: number,
      identityType: 'login',
      identityValue: 'homer@ipex.cz'
    }
  })

  return response.data.dbHost
}
