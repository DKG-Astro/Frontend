import React, { useState, useEffect } from 'react';
import { Card, Table, DatePicker, Button, message, Spin, Statistic, Row, Col, Typography } from 'antd';
import { 
  CalculatorOutlined, 
  DownloadOutlined,
  BankOutlined,
  UserOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { apiCall } from '../../utils/CommonFunctions';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const TrialBalance = () => {
  const { token } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [trialBalanceData, setTrialBalanceData] = useState([]);
  const [summary, setSummary] = useState({
    totalDebits: 0,
    totalCredits: 0,
    difference: 0,
    isBalanced: true
  });
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    fetchTrialBalanceData();
  }, []);

  const fetchTrialBalanceData = async (startDate = null, endDate = null) => {
    setLoading(true);
    try {
      // Use the existing Tally Integration API to get payment voucher data
      const currentDate = new Date();
      const defaultStartDate = startDate || `01/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
      const defaultEndDate = endDate || `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
      
      const api = `/api/tally-integration/payment-vouchers?startDate=${defaultStartDate}&endDate=${defaultEndDate}`;
      const { data } = await apiCall('GET', api, token);

      if (data?.responseData?.responseData) {
        const vouchers = data.responseData.responseData;
        calculateTrialBalance(vouchers);
      } else {
        setTrialBalanceData([]);
        setSummary({
          totalDebits: 0,
          totalCredits: 0,
          difference: 0,
          isBalanced: true
        });
      }
    } catch (error) {
      message.error("Error fetching trial balance data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTrialBalance = (vouchers) => {
    const ledgerBalances = new Map();
    
    // Process each voucher to calculate ledger balances
    vouchers.forEach(voucher => {
      const paymentAmount = voucher.paidAmount || voucher.partialAmount || voucher.advanceAmount || voucher.totalAmount || 0;
      const vendorName = voucher.vendorName || 'Unknown Vendor';
      
      // Credit entry for vendor (liability reduced)
      if (!ledgerBalances.has(vendorName)) {
        ledgerBalances.set(vendorName, {
          ledgerName: vendorName,
          ledgerType: 'Vendor',
          debitAmount: 0,
          creditAmount: 0,
          balance: 0
        });
      }
      
      const vendorLedger = ledgerBalances.get(vendorName);
      vendorLedger.creditAmount += paymentAmount;
      vendorLedger.balance = vendorLedger.debitAmount - vendorLedger.creditAmount;
      
      // Debit entry for bank account (asset reduced)
      const bankAccount = 'Bank Account';
      if (!ledgerBalances.has(bankAccount)) {
        ledgerBalances.set(bankAccount, {
          ledgerName: bankAccount,
          ledgerType: 'Bank',
          debitAmount: 0,
          creditAmount: 0,
          balance: 0
        });
      }
      
      const bankLedger = ledgerBalances.get(bankAccount);
      bankLedger.debitAmount += paymentAmount;
      bankLedger.balance = bankLedger.debitAmount - bankLedger.creditAmount;
    });

    // Convert to array and add display formatting
    const trialBalanceArray = Array.from(ledgerBalances.values()).map((ledger, index) => ({
      key: index,
      ledgerName: ledger.ledgerName,
      ledgerType: ledger.ledgerType,
      debitAmount: ledger.debitAmount,
      creditAmount: ledger.creditAmount,
      balance: ledger.balance,
      balanceType: ledger.balance >= 0 ? 'Dr' : 'Cr',
      displayBalance: Math.abs(ledger.balance)
    }));

    // Calculate summary
    const totalDebits = trialBalanceArray.reduce((sum, ledger) => sum + ledger.debitAmount, 0);
    const totalCredits = trialBalanceArray.reduce((sum, ledger) => sum + ledger.creditAmount, 0);
    const difference = Math.abs(totalDebits - totalCredits);
    const isBalanced = difference < 0.01; // Allow for small rounding differences

    setTrialBalanceData(trialBalanceArray);
    setSummary({
      totalDebits,
      totalCredits,
      difference,
      isBalanced
    });
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0].format('DD/MM/YYYY');
      const endDate = dates[1].format('DD/MM/YYYY');
      fetchTrialBalanceData(startDate, endDate);
    } else {
      fetchTrialBalanceData();
    }
  };

  const exportTrialBalance = () => {
    // Simple CSV export
    const csvContent = [
      ['Ledger Name', 'Type', 'Debit Amount', 'Credit Amount', 'Balance', 'Dr/Cr'],
      ...trialBalanceData.map(row => [
        row.ledgerName,
        row.ledgerType,
        row.debitAmount,
        row.creditAmount,
        row.displayBalance,
        row.balanceType
      ]),
      ['', '', '', '', '', ''],
      ['TOTALS', '', summary.totalDebits, summary.totalCredits, summary.difference, summary.isBalanced ? 'BALANCED' : 'NOT BALANCED']
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trial_balance_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    message.success("Trial balance exported successfully");
  };

  const columns = [
    {
      title: 'Ledger Name',
      dataIndex: 'ledgerName',
      key: 'ledgerName',
      width: 200,
      render: (text, record) => (
        <div className="flex items-center">
          {record.ledgerType === 'Bank' ? <BankOutlined className="mr-2" /> : <UserOutlined className="mr-2" />}
          {text}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'ledgerType',
      key: 'ledgerType',
      width: 100,
    },
    {
      title: 'Debit Amount',
      dataIndex: 'debitAmount',
      key: 'debitAmount',
      width: 150,
      align: 'right',
      render: (amount) => amount > 0 ? `₹${amount.toLocaleString()}` : '-',
    },
    {
      title: 'Credit Amount',
      dataIndex: 'creditAmount',
      key: 'creditAmount',
      width: 150,
      align: 'right',
      render: (amount) => amount > 0 ? `₹${amount.toLocaleString()}` : '-',
    },
    {
      title: 'Balance',
      dataIndex: 'displayBalance',
      key: 'balance',
      width: 150,
      align: 'right',
      render: (balance, record) => (
        <span className={record.balanceType === 'Dr' ? 'text-green-600' : 'text-red-600'}>
          ₹{balance.toLocaleString()} {record.balanceType}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Trial Balance</h1>
        <p className="text-gray-600">Simplified trial balance based on payment voucher data</p>
      </div>

      {/* Date Range Filter */}
      <div className="mb-6 flex justify-between items-center">
        <RangePicker
          onChange={handleDateRangeChange}
          format="DD/MM/YYYY"
          placeholder={['Start Date', 'End Date']}
        />
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={exportTrialBalance}
          disabled={trialBalanceData.length === 0}
        >
          Export CSV
        </Button>
      </div>

      <Spin spinning={loading}>
        {/* Summary Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Debits"
                value={summary.totalDebits}
                precision={0}
                valueStyle={{ color: '#52c41a' }}
                prefix={<DollarOutlined />}
                formatter={(value) => `₹${value?.toLocaleString() || 0}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Credits"
                value={summary.totalCredits}
                precision={0}
                valueStyle={{ color: '#1890ff' }}
                prefix={<DollarOutlined />}
                formatter={(value) => `₹${value?.toLocaleString() || 0}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Status"
                value={summary.isBalanced ? 'BALANCED' : 'NOT BALANCED'}
                valueStyle={{ color: summary.isBalanced ? '#52c41a' : '#f5222d' }}
                prefix={<CalculatorOutlined />}
              />
              {!summary.isBalanced && (
                <div className="mt-2 text-sm text-red-600">
                  Difference: ₹{summary.difference.toLocaleString()}
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Trial Balance Table */}
        <Card title="Trial Balance" extra={`${trialBalanceData.length} ledgers`}>
          <Table
            columns={columns}
            dataSource={trialBalanceData}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} ledgers`,
            }}
            scroll={{ x: true }}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>
                    <strong>TOTALS</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}></Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right">
                    <strong>₹{summary.totalDebits.toLocaleString()}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="right">
                    <strong>₹{summary.totalCredits.toLocaleString()}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="right">
                    <strong className={summary.isBalanced ? 'text-green-600' : 'text-red-600'}>
                      {summary.isBalanced ? 'BALANCED' : `DIFF: ₹${summary.difference.toLocaleString()}`}
                    </strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </Card>

        {trialBalanceData.length === 0 && !loading && (
          <Card>
            <div className="text-center py-12">
              <CalculatorOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Data Available</h3>
              <p className="mt-2 text-gray-600">
                No payment voucher data found for the selected date range.
              </p>
            </div>
          </Card>
        )}
      </Spin>
    </div>
  );
};

export default TrialBalance;
