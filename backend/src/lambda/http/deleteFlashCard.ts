import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import { removeFlashCard } from '../../businessLogic/flashcards'
import { createLogger } from '../../utils/logger'
import { getFlashCard } from '../../businessLogic/flashcards'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('deleteFlashCard')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing delete event: ', event)
  logger.info('Started Proccess to Delete FlashCardId: ', event.pathParameters.flashCardId)
  
  const flashCardId = event.pathParameters.flashCardId
  const userId = getUserId(event)

  // Verify existance in database
  const item = await getFlashCard(userId, flashCardId)

  if (item.length === 0) {
    logger.info('Invalid ID: ', flashCardId)
    return {
      statusCode: 404,
      body: 'flashCardId not found'
    }
  }
  await removeFlashCard(userId, flashCardId)

  return {
    statusCode: 200,
    body: ''
  }

})

handler.use(
  cors({
    credentials: true
  })
)
