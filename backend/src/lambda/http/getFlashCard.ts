import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getFlashCard } from '../../businessLogic/flashcards'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('getFlashCard')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing get event: ', event)

  const userId = getUserId(event)
  const flashCardId = event.pathParameters.flashCardId

  const item = await getFlashCard(userId, flashCardId)

  if (item.length === 0){
    logger.info('Incorrect ID: ', flashCardId)
    return {
        statusCode: 404,
        body: 'flashCardId does not exist'
      }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      item
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)