import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { updateFlashCardUrl } from '../../businessLogic/flashcards'
import { getUserId } from '../utils'
import * as AWSXRay from 'aws-xray-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.ATTACHEMENTS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const logger = createLogger('generateUploadUrl')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing generation of presigned URL for event: ', event)
  
  const flashCardId = event.pathParameters.flashCardId
  
  // Update dynamoDb with Url
  const uploadUrl = getURLToUpload(flashCardId)
  const userId = getUserId(event)
  const updatedFlashCard = {
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${flashCardId}`
  }

  await updateFlashCardUrl(updatedFlashCard, userId, flashCardId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl
    })
  }
})

function getURLToUpload(flashCardId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: flashCardId,
    Expires: urlExpiration
  })
}

handler.use(
  cors({
    credentials: true
  })
)
