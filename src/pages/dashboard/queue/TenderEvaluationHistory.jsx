import { Modal, Table, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { HistoryOutlined } from '@ant-design/icons';

const TenderEvaluationHistory = ({
  tenderId,
  vendorId,
  open,
  onCancel,
}) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (text) =>
    text
      ? new Date(text).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '--';
const roleMap = {
  18: 'Indent Creator',
  17: 'Reporting Officer'
};

  const columns = [
   /* {
      title: 'Current Role',
      dataIndex: 'currentRole',
      key: 'currentRole',
      render: (t) => <Tag>{t || '--'}</Tag>,
    },
    {
      title: 'Next Role',
      dataIndex: 'nextRole',
      key: 'nextRole',
      render: (t) => <Tag>{t || '--'}</Tag>,
    }*/
  {
    title: 'Current Role',
    dataIndex: 'currentRole',
    key: 'currentRole',
    render: (_, record) => {
      let roleLabel = record.currentRole;
      if (
        record.currentRole?.toLowerCase() === 'indentor' &&
        roleMap[record.modifiedBy]
      ) {
        roleLabel = roleMap[record.modifiedBy];
      }
      return <Tag>{roleLabel || '--'}</Tag>;
    },
  },
  {
      title: 'Next Role',
      dataIndex: 'nextRole',
      key: 'nextRole',
      render: (t) => <Tag>{t || '--'}</Tag>,
    },
 /* {
    title: 'Next Role',
    dataIndex: 'nextRole',
    key: 'nextRole',
    render: (_, record) => {
      let roleLabel = record.nextRole;
      if (
        record.nextRole?.toLowerCase() === 'indentor' &&
        roleMap[record.modifiedBy]
      ) {
        roleLabel = roleMap[record.modifiedBy];
      }
      return <Tag>{roleLabel || '--'}</Tag>;
    }},*/
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (t) => (
        <Tag color={t === 'APPROVED' ? 'green' : 'blue'}>{t || '--'}</Tag>
      ),
    },
    {
      title: 'Acceptance',
      dataIndex: 'acceptanceStatus',
      key: 'acceptanceStatus',
      render: (t) => t || '--',
    },
    { title: 'Indentor Status', dataIndex: 'indentorStatus', key: 'indentorStatus' },
    {
      title: 'Indentor Remarks',
      dataIndex: 'indentorRemarks',
      key: 'indentorRemarks',
      render: (t) => t || '--',
    },
    { title: 'SPO Status', dataIndex: 'spoStatus', key: 'spoStatus' },
    {
      title: 'SPO Remarks',
      dataIndex: 'spoRemarks',
      key: 'spoRemarks',
      render: (t) => t || '--',
    },
    { title: 'Modified By', dataIndex: 'modifiedBy', key: 'modifiedBy' },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (t) => formatDate(t),
    },
    {
      title: 'Updated Date',
      dataIndex: 'updatedDate',
      key: 'updatedDate',
      render: (t) => formatDate(t),
    },
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      if (open && tenderId && vendorId) {
        setLoading(true);
        try {
          const response = await axios.get(
            `/api/vendor-quotation/tenderEvaluationHistory/${encodeURIComponent(
              tenderId
            )}/${encodeURIComponent(vendorId)}`
          );
          const historyData = Array.isArray(response?.data?.responseData)
            ? response.data.responseData
            : [];
          setHistory(historyData);
        } catch (error) {
          console.error('Error fetching history:', error);
          setHistory([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchHistory();
  }, [open, tenderId, vendorId]);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <HistoryOutlined />
          Workflow History for {tenderId} / {vendorId}
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <Spin spinning={loading}>
        <Table
          dataSource={history}
          columns={columns}
          rowKey="id"
          pagination={false}
          scroll={{ x: true }}
          bordered
          size="small"
          locale={{
            emptyText: 'No workflow history found',
          }}
        />
      </Spin>
    </Modal>
  );
};

export default TenderEvaluationHistory;
