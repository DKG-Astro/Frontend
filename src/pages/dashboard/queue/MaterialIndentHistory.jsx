import { Modal, Table, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { HistoryOutlined } from '@ant-design/icons';

const MaterialHistory = ({ materialCode, open, onCancel }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'Indent ID',
      dataIndex: 'indentId',
      key: 'indentId',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      render: (text) => text || '--',
    },
  ];

  useEffect(() => {
    const fetchMaterialHistory = async () => {
      if (open && materialCode) {
        setLoading(true);
        try {
          const response = await axios.get(
            `/api/indents/materialHistory/${materialCode}`
          );

          const historyData = Array.isArray(response?.data?.responseData)
            ? response.data.responseData
            : [];

          setHistory(historyData);
        } catch (error) {
          console.error('Error fetching material history:', error);
          setHistory([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMaterialHistory();
  }, [open, materialCode]);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <HistoryOutlined />
          Indent History for Material: {materialCode}
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Spin spinning={loading}>
        <Table
          dataSource={history}
          columns={columns}
          rowKey="indentId"
          pagination={false}
          bordered
          size="small"
          locale={{ emptyText: 'No material history found' }}
        />
      </Spin>
    </Modal>
  );
};

export default MaterialHistory;
