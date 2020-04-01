import React, { FunctionComponent, Component } from 'react';
import { Modal, Button, Table, Tag } from 'antd';

interface RankingProp {
  ranking: string
}
const columns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
    render: (ranking: number) => {
      let color = 'blue'
      switch (ranking) {
        case 1: { color = 'gold'; break; }
        case 2: { color = 'silver'; break; }
        case 3: { color = 'brown'; break; }
        default: { break; }
      }
      return (
        <Tag color={color} key={ranking}>
          {ranking}
        </Tag>
      );
    }
  },
  {
    title: 'Score',
    key: 'score',
    dataIndex: 'score',
  },
];

interface TopPlayerModalProps {
  visible: boolean,
  onClose: () => void,
  ranking: string
}

const TopPlyerModal: FunctionComponent<TopPlayerModalProps> = ({
  visible = false,
  onClose,
  ranking,
}) => {
  const datas = ranking.split(',').map((score, index) => ({
    rank: index+1,
    score
  }));
  return (
    <Modal
      visible={visible}
      title="Top Ranking"
      onOk={onClose}
      onCancel={onClose}
      footer={[
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button key="back" onClick={onClose} type="primary">
            Ok
          </Button>,
        </div>
      ]}
    >
      <Table columns={columns} dataSource={datas} />
    </Modal>
  )
}

export default TopPlyerModal;