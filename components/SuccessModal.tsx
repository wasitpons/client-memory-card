import React, { FunctionComponent } from 'react';
import { Modal, Button } from 'antd';

interface SuccessModalProps {
  visible: boolean,
  clicked: number,
  onClose: () => void,
  onRestart: () => void
}

const SuccessModal: FunctionComponent<SuccessModalProps> = ({
  visible = false,
  onClose,
  onRestart,
  clicked
}) => (
  <Modal
    visible={visible}
    title="Done"
    onOk={onClose}
    onCancel={onClose}
    footer={[
      <div style={{ display: 'flex', justifyContent: 'center'}}>
        <Button key="back" onClick={onClose}>
          Return
        </Button>,
        <Button key="restart" onClick={onRestart} type="primary">
          Restart
        </Button>,
      </div>
    ]}
  >
    {`Your score is: ${clicked}`}
  </Modal>
);

export default SuccessModal;