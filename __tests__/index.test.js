import { shallow } from 'enzyme'
import fetch from 'isomorphic-unfetch';
import IndexPage from '../pages/index';

const mockCards = [{
  cardId: 1,
  value: 1,
  isMatched: false,
  isFlipped: false,
}, {
  cardId: 2,
  value: 2,
  isMatched: false,
  isFlipped: false,
}, {
  cardId: 3,
  value: 1,
  isMatched: false,
  isFlipped: false,
}];

const defaultState = {
  clicked: 0,
  cards: mockCards,
  selectedCards: [],
  matchedCardAmount: 0,
  visible: false,
  globalRanking: 0,
  best: 0,
}
describe('IndexPage', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<IndexPage />);
    const instance = wrapper.instance();
    expect(instance.state).toEqual(defaultState);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call API properly', async () => {
    jest.mock('fetch', () => ({
      data: {
        globalRanking: 1,
      }
    }));
    const wrapper = shallow(<IndexPage />);
    wrapper.instance().handleSubmit();
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5000/save-ranking',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clicked: 0
        })
      }, 
    );
    expect(fetch).toHaveReturnedWith({
      data: {
        globalRanking: 1,
      }
    });
  });

  it('should flip card when user click on Card', () => {
    const wrapper = shallow(<IndexPage />);
    wrapper.find('.card').first().simulate('click');
    wrapper.update();
    expect(wrapper.state).toEqual({
      clicked: 1,
      cards: [{
        cardId: 1,
        value: 1,
        isMatched: false,
        isFlipped: true, // first card was flip
      }, {
        cardId: 2,
        value: 2,
        isMatched: false,
        isFlipped: false,
      }, {
        cardId: 3,
        value: 1,
        isMatched: false,
        isFlipped: false,
      }],
      selectedCards: [{
        cardId: 1,
        value: 1,
        isMatched: false,
        isFlipped: true, // first card was flip
      }],
      matchedCardAmount: 0,
      visible: false,
      globalRanking: 0,
      best: 0,
    });
  });

  it('should compare value of card when user select 2 card -- in case 2 cards is matched', () => {
    const wrapper = shallow(<IndexPage />);
    wrapper.find('.card').first().simulate('click');
    wrapper.find('.card').last().simulate('click');
    wrapper.update();
    expect(wrapper.state).toEqual({
      clicked: 2, // click first card & last card
      cards: [{
        cardId: 1,
        value: 1,
        isMatched: true, // is match with last card
        isFlipped: true, // first card was flip
      }, {
        cardId: 2,
        value: 2,
        isMatched: false,
        isFlipped: false,
      }, {
        cardId: 3,
        value: 1,
        isMatched: false,
        isFlipped: true, // last card was flip
      }],
      selectedCards: [],
      matchedCardAmount: 0,
      visible: false,
      globalRanking: 0,
      best: 0,
    });
  });
  it('should compare value of card when user select 2 card -- in case 2 cards is mismatch', () => {
    const wrapper = shallow(<IndexPage />);
    wrapper.find('.card').first().simulate('click');
    wrapper.find('.card').childAt(1).simulate('click');
    wrapper.update();
    expect(wrapper.state).toEqual({
      clicked: 2, // click first card & last card
      cards: [{
        cardId: 1,
        value: 1,
        isMatched: false,
        isFlipped: false,
      }, {
        cardId: 2,
        value: 2,
        isMatched: false,
        isFlipped: false,
      }, {
        cardId: 3,
        value: 1,
        isMatched: false,
        isFlipped: false,
      }],
      selectedCards: [],
      matchedCardAmount: 0,
      visible: false,
      globalRanking: 0,
      best: 0,
    });
  });
})