import React, { FunctionComponent } from 'react';
import { Affix, Col, Row } from 'antd';
import { ReloadOutlined, CrownOutlined } from '@ant-design/icons';

import './Header.scss';

interface HeaderProps {
  best: number,
  globalRanking: number
  clicked: number
  onRestart: () => void
  onTopPlayer: () => void
}

const Header: FunctionComponent<HeaderProps> = ({
  best = 0,
  globalRanking = 0,
  clicked = 0,
  onRestart,
  onTopPlayer,
}) => (
  <Affix offsetTop={0}>
    <Row className="HeaderContainer">
      <Col span={8}>
        <div className="description">Clicked</div>
        <div className="value">{clicked}</div>
      </Col>
      <Col span={8}>
        <div className="description">Best</div>
        <div className="value">{best}</div>
      </Col>
      <Col span={8}>
        <div className="description">Global Ranking</div>
        <div className="value">{globalRanking}</div>
      </Col>
      <div className="buttonContainer">
        <div
          className="restartButton"
          onClick={() => onRestart()}
        >
         <ReloadOutlined /> Restart
        </div>
        <div
          className="topRankingButton"
          onClick={() => onTopPlayer()}
        >
         <CrownOutlined /> Top Ranking
        </div>
      </div>
    </Row>
  </Affix>
);

export default Header;