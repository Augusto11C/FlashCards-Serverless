import * as uuid from 'uuid'

import { FlashCardItem } from '../models/FlashCardItem'
import { FlashCardRepository } from '../dataLayer/flashCardRepository'
import { CreateFlashCardRequest } from '../requests/CreateFlashCardRequest'
import { UpdateFlashCardRequest } from '../requests/UpdateFlashRequest'

const flashCardRepository = new FlashCardRepository()

export async function getFlashCard(userId: string, flashCardId: string): Promise<FlashCardItem[]>{
    return flashCardRepository.getFlashCardByIdAndUserId(userId, flashCardId)
}

export async function createFlashCard(createFlashCardRequest: CreateFlashCardRequest, userId: string): Promise<FlashCardItem>{
    const createdAt = new Date().toISOString()
    const flashCardId = uuid.v4()
    return await flashCardRepository.createFlashCard({
        userId,
        flashCardId: flashCardId,
        createdAt,
        info: createFlashCardRequest.info,
        title: createFlashCardRequest.title,
        done: false,
    })
}

export async function updateFlashCard(updateFlashCardRequest: UpdateFlashCardRequest, userId: string, flashCardId: string): Promise<FlashCardItem>{
    return await flashCardRepository.updateFlashCard({
        userId,
        flashCardId: flashCardId,
        title: updateFlashCardRequest.title,
        info: updateFlashCardRequest.info,
        done: updateFlashCardRequest.done
    })
}

export async function getAllFlashCards(userId: string): Promise<FlashCardItem[]>{
    return flashCardRepository.getAllFlashCardsByUserId(userId)
}

export async function removeFlashCard(userId: string, flashCardId: string){
    return await flashCardRepository.removeFlashCardByIdAndByUserID(userId, flashCardId)
}

export async function updateFlashCardUrl(updateFlashCard, userId: string, flashCardId: string): Promise<FlashCardItem>{
    return await flashCardRepository.updateFlashCardUrl({
        userId,
        flashCardId: flashCardId,
        attachmentUrl: updateFlashCard.attachmentUrl,
    })
}