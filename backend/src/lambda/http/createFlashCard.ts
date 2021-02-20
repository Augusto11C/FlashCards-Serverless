import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateFlashCardRequest } from '../../requests/CreateFlashCardRequest'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'
import { createFlashCard } from '../../businessLogic/flashcards'

const logger = createLogger('createFlashCard')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing create event: ', event)

  const userId = getUserId(event)
  const newFlashCard: CreateFlashCardRequest = JSON.parse(event.body)
  const newItem = await createFlashCard(newFlashCard, userId)

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newItem
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
