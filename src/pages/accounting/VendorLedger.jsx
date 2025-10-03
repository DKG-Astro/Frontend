import React, { useState, useEffect } from 'react';
import { Card, Select, Table, Statistic, Row, Col, DatePicker, message, Spin, Timeline, Tag } from 'antd';
import { 
  UserOutlined, 
  DollarOutlined, 
  CalendarOutlined,
  BankOutlined,
  FallOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { apiCall } from '../../utils/CommonFunctions';

const { Option } = Select;
const { RangePicker } = DatePicker;

const VendorLedger = () => {
  const { token } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorData, setVendorData] = useState({
    vendorInfo: {},
    transactions: [],
    summary: {
      totalPaid: 0,
      transactionCount: 0,
      averagePayment: 0,
      lastPaymentDate: null
    }
  });
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      // Get current month data to extract vendor list
      const currentDate = new Date();
      const startDate = `01/01/${currentDate.getFullYear()}`;
      const endDate = `31/12/${currentDate.getFullYear()}`;
      
      const api = `/api/tally-integration/payment-vouchers?startDate=${startDate}&endDate=${endDate}`;
      const { data } = await apiCall('GET', api, token);

      if (data?.responseData?.responseData) {
        const vouchers = data.responseData.responseData;
        
        // Extract unique vendors
        const vendorMap = new Map();
        vouchers.forEach(voucher => {
          if (voucher.vendorName) {
            if (!vendorMap.has(voucher.vendorName)) {
              vendorMap.set(voucher.vendorName, {
                name: voucher.vendorName,
                totalAmount: 0,
                transactionCount: 0
              });
            }
            
            const vendor = vendorMap.get(voucher.vendorName);
            const amount = voucher.paidAmount || voucher.partialAmount || voucher.advanceAmount || voucher.totalAmount || 0;
            vendor.totalAmount += amount;
            vendor.transactionCount += 1;
          }
        });

        const vendorList = Array.from(vendorMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
        setVendors(vendorList);
      }
    } catch (error) {
      message.error("Error fetching vendors");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorTransactions = async (vendorName, startDate = null, endDate = null) => {
    if (!vendorName) return;
    
    setVendorLoading(true);
    try {
      // Use broader date range if not specified
      const currentDate = new Date();
      const defaultStartDate = startDate || `01/01/${currentDate.getFullYear()}`;
      const defaultEndDate = endDate || `31/12/${currentDate.getFullYear()}`;
      
      const api = `/api/tally-integration/payment-vouchers?startDate=${defaultStartDate}&endDate=${defaultEndDate}`;
      const { data } = await apiCall('GET', api, token);

      if (data?.responseData?.responseData) {
        const allVouchers = data.responseData.responseData;
        
        // Filter vouchers for selected vendor
        const vendorVouchers = allVouchers.filter(voucher => voucher.vendorName === vendorName);
        
        // Process transactions
        const transactions = vendorVouchers.map((voucher, index) => {
          const amount = voucher.paidAmount || voucher.partialAmount || voucher.advanceAmount || voucher.totalAmount || 0;
          const totalAmount = voucher.totalAmount || 0;
          const balance = totalAmount - amount;
          
          return {
            key: voucher.paymentVoucherNumber || `transaction-${index}`,
            date: voucher.paymentVoucherDate,
            voucherNumber: voucher.paymentVoucherNumber,
            invoiceNumber: voucher.vendorInvoiceNumber,
            poNumber: voucher.purchaseOrderId,
            soNumber: voucher.soId,
            totalAmount: totalAmount,
            paidAmount: amount,
            balanceAmount: balance,
            paymentType: voucher.paymentVoucherType || 'Payment',
            narration: `Payment for ${voucher.paymentVoucherIsFor || 'Purchase'} - ${voucher.vendorInvoiceNumber || 'N/A'}`
          };
        }).sort((a, b) => {
          const dateA = new Date(a.date?.split('/').reverse().join('-') || 0);
          const dateB = new Date(b.date?.split('/').reverse().join('-') || 0);
          return dateB - dateA;
        });

        // Calculate summary
        const totalPaid = transactions.reduce((sum, t) => sum + (t.paidAmount || 0), 0);
        const transactionCount = transactions.length;
        const averagePayment = transactionCount > 0 ? totalPaid / transactionCount : 0;
        const lastPaymentDate = transactions.length > 0 ? transactions[0].date : null;

        setVendorData({
          vendorInfo: {
            name: vendorName,
            totalTransactions: transactionCount
          },
          transactions,
          summary: {
            totalPaid,
            transactionCount,
            averagePayment,
            lastPaymentDate
          }
        });
      }
    } catch (error) {
      message.error("Error fetching vendor transactions");
      console.error(error);
    } finally {
      setVendorLoading(false);
    }
  };

  const handleVendorChange = (vendorName) => {
    setSelectedVendor(vendorName);
    const startDate = dateRange[0] ? dateRange[0].format('DD/MM/YYYY') : null;
    const endDate = dateRange[1] ? dateRange[1].format('DD/MM/YYYY') : null;
    fetchVendorTransactions(vendorName, startDate, endDate);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (selectedVendor) {
      const startDate = dates && dates[0] ? dates[0].format('DD/MM/YYYY') : null;
      const endDate = dates && dates[1] ? dates[1].format('DD/MM/YYYY') : null;
      fetchVendorTransactions(selectedVendor, startDate, endDate);
    }
  };

  const transactionColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      sorter: (a, b) => {
        const dateA = new Date(a.date?.split('/').reverse().join('-') || 0);
        const dateB = new Date(b.date?.split('/').reverse().join('-') || 0);
        return dateA - dateB;
      },
    },
    {
      title: 'Voucher No.',
      dataIndex: 'voucherNumber',
      key: 'voucherNumber',
      width: 120,
    },
    {
      title: 'Invoice No.',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      width: 120,
      render: (text) => text || 'N/A',
    },
    {
      title: 'PO/SO No.',
      dataIndex: 'poNumber',
      key: 'poNumber',
      width: 100,
      render: (text, record) => record.poNumber || record.soNumber || 'N/A',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount) => `₹${amount?.toLocaleString() || 0}`,
    },
    {
      title: 'Paid Amount',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      width: 120,
      render: (amount) => (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
          ₹{amount?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balanceAmount',
      key: 'balanceAmount',
      width: 100,
      render: (balance) => (
        <Tag color={balance > 0 ? 'red' : 'green'}>
          ₹{balance?.toLocaleString() || 0}
        </Tag>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'paymentType',
      key: 'paymentType',
      width: 100,
    },
  ];

  // Create timeline data
  const timelineData = vendorData.transactions.slice(0, 5).map(transaction => ({
    color: transaction.balanceAmount > 0 ? 'red' : 'green',
    children: (
      <div>
        <div className="font-medium">{transaction.date}</div>
        <div className="text-sm text-gray-600">
          {transaction.voucherNumber} - ₹{transaction.paidAmount?.toLocaleString() || 0}
        </div>
        <div className="text-xs text-gray-500">{transaction.narration}</div>
      </div>
    ),
  }));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Vendor Ledger</h1>
        <p className="text-gray-600">View transaction history and balances for each vendor</p>
      </div>

      {/* Filters */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <Select
            placeholder="Select a vendor"
            style={{ width: '100%' }}
            loading={loading}
            onChange={handleVendorChange}
            value={selectedVendor}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {vendors.map(vendor => (
              <Option key={vendor.name} value={vendor.name}>
                {vendor.name} ({vendor.transactionCount} transactions)
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={12}>
          <RangePicker
            onChange={handleDateRangeChange}
            format="DD/MM/YYYY"
            placeholder={['Start Date', 'End Date']}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      {selectedVendor && (
        <Spin spinning={vendorLoading}>
          {/* Vendor Summary */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Paid"
                  value={vendorData.summary.totalPaid}
                  precision={0}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<DollarOutlined />}
                  formatter={(value) => `₹${value?.toLocaleString() || 0}`}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Transactions"
                  value={vendorData.summary.transactionCount}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<BankOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Average Payment"
                  value={vendorData.summary.averagePayment}
                  precision={0}
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<FallOutlined />}
                  formatter={(value) => `₹${value?.toLocaleString() || 0}`}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Last Payment"
                  value={vendorData.summary.lastPaymentDate || 'N/A'}
                  valueStyle={{ color: '#fa8c16' }}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Transaction History and Timeline */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title={`Transaction History - ${selectedVendor}`}>
                <Table
                  columns={transactionColumns}
                  dataSource={vendorData.transactions}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} transactions`,
                  }}
                  scroll={{ x: true }}
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Recent Payments Timeline">
                {timelineData.length > 0 ? (
                  <Timeline items={timelineData} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No recent payments found
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </Spin>
      )}

      {!selectedVendor && (
        <Card>
          <div className="text-center py-12">
            <UserOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Select a Vendor</h3>
            <p className="mt-2 text-gray-600">
              Choose a vendor from the dropdown above to view their transaction history and ledger details.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VendorLedger;
