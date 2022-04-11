import * as NodeCache from 'node-cache'

import { PBX_DETAIL_CACHE_DURATION, PBX_DETAIL_CACHE_PERIOD } from '~/config'

const nodeCache = new NodeCache({
  stdTTL: PBX_DETAIL_CACHE_DURATION,
  checkperiod: PBX_DETAIL_CACHE_PERIOD
})

export default nodeCache
