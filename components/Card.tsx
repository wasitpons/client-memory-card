import React, { PureComponent } from 'react';
import ReactCardFlip from 'react-card-flip';
import './Card.scss';

const defaultCardProps = {
  flipSpeedBackToFront: 0.75,
  flipSpeedFrontToBack: 0.75,
  flipDirection: 'vertical' as const,
}

interface CardProps {
  cardId: number
  value: number
  isMatched: boolean
  isFlipped: boolean
}

class Card extends PureComponent<CardProps, {}> {
  renderFrontCard = () => (
    <div className="cardContainer">
      <img className="image" src='/bluepi-logo.png' alt="logo" />
    </div>
  );

  renderBackCard = () => (
    <div className="cardContainer">
      <span className="value">{ this.props.isFlipped && this.props.value }</span>
    </div>
  );
  
  render() {
    return (
      <ReactCardFlip {...defaultCardProps} isFlipped={this.props.isFlipped}>
        { this.renderFrontCard() }
        { this.renderBackCard() }
      </ReactCardFlip>
    )
  }
}

export default Card;