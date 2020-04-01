import * as React from 'react';
import { Modal, Button } from 'antd';
import { shuffle, map, get, size, first } from 'lodash';
import fetch from 'isomorphic-unfetch';
import Card from '../components/Card';
import Header from '../components/Header';
import SuccessModal from '../components/SuccessModal';
import TopPlayerModal from '../components/TopPlayerModal';

import './index.scss';

const CARD_VALUES = [
  1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6
];

interface CardProps {
  cardId: number
  value: number
  isMatched: boolean
  isFlipped: boolean
}

interface IndexPageState {
  clicked: number
  cards: CardProps[]
  selectedCards: CardProps[]
  matchedCardAmount: number
  successModalVisible: boolean
  topPlayerVisible: boolean
  globalRanking: number
  best: number
  topPlayerRanking: string
}

export class IndexPage extends React.Component<{}, IndexPageState> {
  constructor(props: []) {
    super(props);
    this.state = {
      clicked: 0,
      cards: this.generateCard(),
      selectedCards: [],
      matchedCardAmount: 0,
      successModalVisible: false,
      topPlayerVisible: false,
      globalRanking: 0,
      best: 0,
      topPlayerRanking: '',
    };
  }

  updateCardStatus = (selectedCardId: number, status: boolean) =>
    map(this.state.cards, (card) => {
      if (card.cardId === selectedCardId) {
        return {
          ...card,
          isFlipped: status,
        };
      }
      return card;
    })

  update2CardStatus = (firstCardId: number, lastCardId: number, status: boolean) => 
    map(this.state.cards, (card) => {
      if (card.cardId === firstCardId || card.cardId === lastCardId) {
        return {
          ...card,
          isFlipped: status,
        };
      }
      return card;
    })
  
  update2CardMatched = (firstCardId: number, lastCardId: number, status: boolean) => 
    map(this.state.cards, (card) => {
      if (card.cardId === firstCardId || card.cardId === lastCardId) {
        return {
          ...card,
          isMatched: status,
        };
      }
      return card;
    })
  
  generateCard = () => {
    const cardValues = shuffle(CARD_VALUES);
    return cardValues.map((cardValues, index) => ({
      cardId: index,
      value: cardValues,
      isMatched: false,
      isFlipped: false,
    }));
  }

  handleSubmit = async () => {
    this.setState({ successModalVisible: true });
    const res = await fetch('http://localhost:5000/save-ranking', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clicked: this.state.clicked
      })
    });
  
    const data = await res.json();
    const globalRanking = get(data, 'data.globalRanking', 0);
    const best = this.state.best === 0 || ( this.state.clicked < this.state.best )
    ? this.state.clicked : this.state.best;
    this.setState({
      globalRanking,
      best
    })
  }

  handleGetTopPlayer = async () => {
    const res = await fetch('http://localhost:5000/find-ranking', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    const data = await res.json();
    const topPlayerRanking = get(data, 'data.ranking', 0);
    this.setState({ topPlayerRanking });
  }
  handleSuccessModalConfirm = () => this.setState({ successModalVisible: false });
  handleTopPlayerModalConfirm = () => this.setState({ topPlayerVisible: false });
  handleTopPlayerModalClick = () => {
    this.setState({ topPlayerVisible: true }, async () => {
      await this.handleGetTopPlayer();
    });
    
  }

  handleRestart = () => this.setState({
    cards: this.generateCard(),
    selectedCards: [],
    clicked: 0,
    matchedCardAmount: 0,
    successModalVisible: false
  });

  handleCardSelect = async (value: number, cardId: number) => {
    const length = size(this.state.selectedCards);
    const selectedCard = get(this.state.cards, `[${cardId}]`);
    const selectedCardId = get(selectedCard, 'cardId');
    const selectedCardValue = get(selectedCard, 'value');
    const isCardMatched = get(selectedCard, 'isCardMatched');

    if (isCardMatched || length >= 2) {
      return ;
    } this.setState({
      cards: this.updateCardStatus(selectedCardId, true)
    })
    switch (length) {
      case 0: {
        this.setState(prevState => ({
          selectedCards: [selectedCard],
          clicked: prevState.clicked + 1
        }));
        break;
      } case 1: {
        const firstCardSelected = first(this.state.selectedCards);
        const firstCardId = get(firstCardSelected, 'cardId', -1);
        const firstCardValue = get(firstCardSelected, 'value');
        if (firstCardId === selectedCardId) {
          break;
        } else {
          if(firstCardValue === selectedCardValue) {
            setTimeout(() => this.setState(prevState => ({
              cards: this.update2CardMatched(firstCardId, selectedCardId, true),
              clicked: prevState.clicked + 1,
              matchedCardAmount: prevState.matchedCardAmount + 2
            }), () => {
              if (this.state.matchedCardAmount === size(CARD_VALUES)) {
                this.handleSubmit();
              }
            }), 1000);
          } else {
            setTimeout(() => this.setState(prevState => ({
              cards: this.update2CardStatus(firstCardId, selectedCardId, false),
              clicked: prevState.clicked + 1
            })), 1000);
          }
          this.setState({ selectedCards: [] });
        }
        break;
      } default: {
        break;
      }
    }
  };

  render() {
    return (
      <>
        <SuccessModal
          key="successModal"
          clicked={this.state.clicked}
          visible={this.state.successModalVisible}
          onClose={this.handleSuccessModalConfirm}
          onRestart={this.handleRestart}
        />
        <TopPlayerModal
          key="topPlayerModal"
          visible={this.state.topPlayerVisible}
          onClose={this.handleTopPlayerModalConfirm}
          ranking={this.state.topPlayerRanking}
        />
        <Header
          clicked={this.state.clicked}
          best={this.state.best}
          globalRanking={this.state.globalRanking}
          onRestart={() => this.handleRestart()}
          onTopPlayer={() => this.handleTopPlayerModalClick()}
        />
        <div className="container">
          {
            map(this.state.cards, ({ value, isMatched, isFlipped, cardId }) => (
              <div
                className="card"
                onClick={() => this.handleCardSelect(value, cardId)}
                key={cardId}
              >
                <Card
                  cardId={cardId}
                  value={value}
                  isMatched={isMatched}
                  isFlipped={isFlipped}
                />
              </div>
            ))
          }
        </div>
      </>
    )
  }
}

export default IndexPage;