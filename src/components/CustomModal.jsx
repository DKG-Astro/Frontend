import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const CustomModal = ({ isOpen, setIsOpen, title, processNo }) => {
//   useEffect(() => {
//     if (isOpen) {
//       const timer = setTimeout(() => {
//         setIsOpen(false);
//       }, 2000);

//       return () => clearTimeout(timer);
//     }
//   }, [isOpen, setIsOpen]);

  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
      centered
      closable
      width={400}
    >
      <div className="flex flex-col items-center py-4">
        <CheckCircleOutlined className="text-green-500 text-4xl mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {title} saved successfully
        </h3>
        <p className="text-gray-600">
          Process No: {processNo}
        </p>
      </div>
    </Modal>
  );
};

export default CustomModal;