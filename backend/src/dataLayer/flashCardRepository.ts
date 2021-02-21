
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { FlashCardItem } from '../models/FlashCardItem'
import * as AWS from 'aws-sdk'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class FlashCardRepository {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly flashCardTable = process.env.FLASHCARDS_TABLE) { }

    async getAllFlashCardsByUserId(userId: string): Promise<FlashCardItem[]> {
        console.log('Getting all FlashCards')

        const result = await this.docClient.query({
            TableName: this.flashCardTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items

        return items as FlashCardItem[]

    }

    async getFlashCardByIdAndUserId(userId: string, flashCardId: string): Promise<FlashCardItem[]> {
        const result = await this.docClient.query({
            TableName: this.flashCardTable,
            KeyConditionExpression: 'userId = :userId AND flashCardId = :flashCardId',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':flashCardId': flashCardId
            }
        }).promise()

        const items = result.Items

        return items as FlashCardItem[]
    }

    async createFlashCard(flashcard: FlashCardItem): Promise<FlashCardItem> {
        await this.docClient.put({
            TableName: this.flashCardTable,
            Item: flashcard,
        }).promise()

        return flashcard

    }

    async updateFlashCard(updatedFlashCard: any): Promise<FlashCardItem> {
        await this.docClient.update({
            TableName: this.flashCardTable,
            Key: {
                flashCardId: updatedFlashCard.flashCardId,
                userId: updatedFlashCard.userId
            },
            ExpressionAttributeNames: { "#N": "title" },
            UpdateExpression: "set #N = :title, info = :info, done = :done",
            ExpressionAttributeValues: {
                ":title": updatedFlashCard.title,
                ":info": updatedFlashCard.info,
                ":done": updatedFlashCard.done,
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()

        return updatedFlashCard

    }

    async updateFlashCardUrl(updatedFlashCard: any): Promise<FlashCardItem> {
        await this.docClient.update({
            TableName: this.flashCardTable,
            Key: {
                flashCardId: updatedFlashCard.flashCardId,
                userId: updatedFlashCard.userId
            },
            ExpressionAttributeNames: { "#A": "attachmentUrl" },
            UpdateExpression: "set #A = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": updatedFlashCard.attachmentUrl,
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()

        return updatedFlashCard

    }

    async removeFlashCardByIdAndByUserID(userId: string, flashCardId: string) {
        const params = {
            TableName: this.flashCardTable,
            Key: {
                flashCardId: flashCardId,
                userId
            }
        }
        await this.docClient.delete(params, function (err, data) {
            if (err) {
                console.error("Unable to delete item", JSON.stringify(err))
            }
            else {
                console.log("DeleteItem succeeded", JSON.stringify(data))
            }
        }).promise()

    }
}