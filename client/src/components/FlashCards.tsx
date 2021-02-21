import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createFlashCard, deleteFlashCard, getFlashCards, patchFlashCard } from '../api/flashcards-api'
import Auth from '../auth/Auth'
import { FlashCard } from '../types/FlashCard'

interface FlashCardsProps {
  auth: Auth
  history: History
}

interface FlashCardsState {
  flashCards: FlashCard[]
  newFlashCardTitle: string
  newFlashCardInfo: string
  loadingFlashCards: boolean
}

export class FlashCards extends React.PureComponent<FlashCardsProps, FlashCardsState> {
  state: FlashCardsState = {
    flashCards: [],
    newFlashCardTitle: '',
    newFlashCardInfo: '',
    loadingFlashCards: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newFlashCardTitle: event.target.value })
  }

  onEditButtonClick = (flashCardId: string) => {
    this.props.history.push(`/flashcards/${flashCardId}/edit`)
  }

  onFlashCardCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newFlashCard = await createFlashCard(this.props.auth.getIdToken(), {
        title: this.state.newFlashCardTitle,
        info: this.state.newFlashCardInfo
      })
      this.setState({
        flashCards: [...this.state.flashCards, newFlashCard],
        newFlashCardTitle: '',
        newFlashCardInfo: ''
      })
    } catch {
      alert('FlashCard creation failed')
    }
  }

  onFlashCardDelete = async (flashCardId: string) => {
    try {
      await deleteFlashCard(this.props.auth.getIdToken(), flashCardId)
      this.setState({
        flashCards: this.state.flashCards.filter(flashCard => flashCard.flashCardId != flashCardId)
      })
    } catch {
      alert('FlashCard deletion failed')
    }
  }

  onFlashCardCheck = async (pos: number) => {
    try {
      const flashCard = this.state.flashCards[pos]
      await patchFlashCard(this.props.auth.getIdToken(), flashCard.flashCardId, {
        title: flashCard.title,
        info: flashCard.info,
        done: !flashCard.done
      })
      this.setState({
        flashCards: update(this.state.flashCards, {
          [pos]: { done: { $set: !flashCard.done } }
        })
      })
    } catch {
      alert('FlashCard deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const flashCards = await getFlashCards(this.props.auth.getIdToken())
      this.setState({
        flashCards: flashCards,
        loadingFlashCards: false
      })
    } catch (e) {
      alert(`Failed to fetch flashCards: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">FlashCards</Header>

        {this.renderCreateFlashCardInput()}

        {this.renderFlashCards()}
      </div>
    )
  }

  // AUG INFO RENDER - New FlashCard
  renderCreateFlashCardInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New FlashCard',
              onClick: this.onFlashCardCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderFlashCards() {
    if (this.state.loadingFlashCards) {
      return this.renderLoading()
    }

    return this.renderFlashCardsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading FlashCards
        </Loader>
      </Grid.Row>
    )
  }

  // AUG INFO RENDER  - FLASHCARD
  renderFlashCardsList() {
    return (
      <Grid padded>
        {this.state.flashCards.map((flashCard, pos) => {
          return (
            <Grid.Row key={flashCard.flashCardId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onFlashCardCheck(pos)}
                  checked={flashCard.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {flashCard.title}
              </Grid.Column>
              <Grid.Column width={10} floated="right">
                {flashCard.info}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(flashCard.flashCardId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onFlashCardDelete(flashCard.flashCardId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {flashCard.attachmentUrl && (
                <Image src={flashCard.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
