/**
 * Fields in a request to update a single FlashCard item.
 */
export interface UpdateFlashCardRequest {
  title: string
  info: string
  done: boolean
}