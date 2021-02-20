import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateFlashCardRequest } from '../../requests/UpdateFlashRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { updateFlashCard } from '../../businessLogic/flashcards'
import { getFlashCard } from '../../businessLogic/flashcards'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('updateFlashCard')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing update event: ', event)

  const flashCardId = event.pathParameters.flashCardId
  const userId = getUserId(event)
  const updatedFlashCard: UpdateFlashCardRequest = JSON.parse(event.body)

  const item = await getFlashCard(userId, flashCardId)
  if (item.length === 0) {
    return {
      statusCode: 404,
      body: 'flashCardId does not exist'
    }
  }

  const items = await updateFlashCard(updatedFlashCard, userId, flashCardId)
  return {
    statusCode: 200,
    body: JSON.stringify(items)
  }

})

handler.use(
  cors({
    credentials: true
  })
)