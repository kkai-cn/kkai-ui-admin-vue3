import { useChannelStoreWithOut } from './channelStore'
import { useConversationStoreWithOut } from './conversationStore'
import { useFaceStoreWithOut } from './faceStore'
import { useFriendStoreWithOut } from './friendStore'
import { useGroupRequestStoreWithOut } from './groupRequestStore'
import { useGroupStoreWithOut } from './groupStore'
import { useMessageStoreWithOut } from './messageStore'

/** 清空 IM 各 Pinia store 内存态（账号切换 / 登出时由 db.stopRequests 调用） */
export function clearAllImStores(): void {
  useMessageStoreWithOut().clear()
  useConversationStoreWithOut().clear()
  useFriendStoreWithOut().clear()
  useGroupStoreWithOut().clear()
  useChannelStoreWithOut().clear()
  useGroupRequestStoreWithOut().clear()
  useFaceStoreWithOut().clear()
}
