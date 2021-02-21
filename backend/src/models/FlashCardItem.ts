export interface FlashCardItem {
  userId: string
  flashCardId: string
  createdAt: string
  title: string
  info: string
  done: boolean
  attachmentUrl?: string
}
