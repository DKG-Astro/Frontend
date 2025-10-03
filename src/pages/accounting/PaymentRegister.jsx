import React, { useState, useEffect } from 'react';
import { Card, Table, DatePicker, Button, message, Spin, Select, Statistic, Row, Col, Tag } from 'antd';
import { 
  CalendarOutlined, 
  DownloadOutlined,
  DollarOutlined,
  UserOutlined,
  FileTextOutlined,
  GroupOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { apiCall } from '../../utils/CommonFunctions';

const { RangePicker } = DatePicker;
const { Option } = Select;

const PaymentRegister = () => {
  const { token } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [groupBy, setGroupBy] = useState('none'); // none, vendor, date
  const [summary, setSummary] = useState({
    totalPayments: 0,
    totalAmount: 0,
    uniqueVendors: 0,
    averagePayment: 0
  });
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    fetchPaymentRegisterData();
  }, []);

  useEffect(() => {
    filterAndGroupData();
  }, [paymentData, selectedVendor, groupBy]);

  const fetchPaymentRegisterData = async (startDate = null, endDate = null) => {
    setLoading(true);
    try {
      // Use broader date range for payment register
      const currentDate = new Date();
      const defaultStartDate = startDate || `01/01/${currentDate.getFullYear()}`;
      const defaultEndDate = endDate || `31/12/${currentDate.getFullYear()}`;
      
      const api = `/api/tally-integration/payment-vouchers?startDate=${defaultStartDate}&endDate=${defaultEndDate}`;
      const { data } = await apiCall('GET', api, token);

      if (data?.responseData?.responseData) {
        const vouchers = data.responseData.responseData;
        processPaymentData(vouchers);
      } else {
        setPaymentData([]);
        setVendors([]);
        setSummary({
          totalPayments: 0,
          totalAmount: 0,
          uniqueVendors: 0,
          averagePayment: 0
        });
      }
    } catch (error) {
      message.error("Error fetching payment register data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const processPaymentData = (vouchers) => {
    // Process vouchers into payment register format
    const payments = vouchers.map((voucher, index) => {
      const paymentAmount = voucher.paidAmount || voucher.partialAmount || voucher.advanceAmount || voucher.totalAmount || 0;
      const totalAmount = voucher.totalAmount || 0;
      const balanceAmount = totalAmount - paymentAmount;
      
      return {
        key: voucher.paymentVoucherNumber || `payment-${index}`,
        date: voucher.paymentVoucherDate,
        voucherNumber: voucher.paymentVoucherNumber,
        vendorName: voucher.vendorName || 'Unknown Vendor',
        invoiceNumber: voucher.vendorInvoiceNumber,
        poNumber: voucher.purchaseOrderId,
        soNumber: voucher.soId,
        paymentType: voucher.paymentVoucherType || 'Payment',
        totalAmount: totalAmount,
        paidAmount: paymentAmount,
        balanceAmount: balanceAmount,
        currency: voucher.currency || 'INR',
        exchangeRate: voucher.exchangeRate || '1.0',
        remarks: voucher.remarks,
        paymentFor: voucher.paymentVoucherIsFor || 'Purchase',
        status: balanceAmount > 0 ? 'Partial' : 'Paid'
      };
    }).sort((a, b) => {
      // Sort by date descending
      const dateA = new Date(a.date?.split('/').reverse().join('-') || 0);
      const dateB = new Date(b.date?.split('/').reverse().join('-') || 0);
      return dateB - dateA;
    });

    // Extract unique vendors
    const uniqueVendors = [...new Set(payments.map(p => p.vendorName))].sort();
    
    // Calculate summary
    const totalAmount = payments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
    const totalPayments = payments.length;
    const uniqueVendorCount = uniqueVendors.length;
    const averagePayment = totalPayments > 0 ? totalAmount / totalPayments : 0;

    setPaymentData(payments);
    setVendors(uniqueVendors);
    setSummary({
      totalPayments,
      totalAmount,
      uniqueVendors: uniqueVendorCount,
      averagePayment
    });
  };

  const filterAndGroupData = () => {
    let filtered = [...paymentData];

    // Apply vendor filter
    if (selectedVendor) {
      filtered = filtered.filter(payment => payment.vendorName === selectedVendor);
    }

    // Apply grouping
    if (groupBy === 'vendor') {
      // Group by vendor
      const grouped = {};
      filtered.forEach(payment => {
        const vendor = payment.vendorName;
        if (!grouped[vendor]) {
          grouped[vendor] = [];
        }
        grouped[vendor].push(payment);
      });

      // Convert to flat array with group headers
      const groupedArray = [];
      Object.entries(grouped).forEach(([vendor, payments]) => {
        const vendorTotal = payments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
        
        // Add group header
        groupedArray.push({
          key: `group-${vendor}`,
          isGroupHeader: true,
          vendorName: vendor,
          totalAmount: vendorTotal,
          paymentCount: payments.length
        });
        
        // Add payments
        payments.forEach(payment => {
          groupedArray.push({
            ...payment,
            isGroupItem: true
          });
        });
      });
      
      filtered = groupedArray;
    } else if (groupBy === 'date') {
      // Group by month
      const grouped = {};
      filtered.forEach(payment => {
        if (payment.date) {
          const monthKey = payment.date.substring(3); // MM/YYYY
          if (!grouped[monthKey]) {
            grouped[monthKey] = [];
          }
          grouped[monthKey].push(payment);
        }
      });

      // Convert to flat array with group headers
      const groupedArray = [];
      Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a)) // Sort by month desc
        .forEach(([month, payments]) => {
          const monthTotal = payments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
          
          // Add group header
          groupedArray.push({
            key: `group-${month}`,
            isGroupHeader: true,
            monthYear: month,
            totalAmount: monthTotal,
            paymentCount: payments.length
          });
          
          // Add payments
          payments.forEach(payment => {
            groupedArray.push({
              ...payment,
              isGroupItem: true
            });
          });
        });
      
      filtered = groupedArray;
    }

    setFilteredData(filtered);
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0].format('DD/MM/YYYY');
      const endDate = dates[1].format('DD/MM/YYYY');
      fetchPaymentRegisterData(startDate, endDate);
    } else {
      fetchPaymentRegisterData();
    }
  };

  const exportPaymentRegister = () => {
    const csvContent = [
      ['Date', 'Voucher Number', 'Vendor', 'Invoice Number', 'PO/SO Number', 'Type', 'Total Amount', 'Paid Amount', 'Balance', 'Status', 'Currency', 'Remarks'],
      ...paymentData.map(row => [
        row.date,
        row.voucherNumber,
        row.vendorName,
        row.invoiceNumber || '',
        row.poNumber || row.soNumber || '',
        row.paymentType,
        row.totalAmount,
        row.paidAmount,
        row.balanceAmount,
        row.status,
        row.currency,
        row.remarks || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment_register_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    message.success("Payment register exported successfully");
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (text, record) => {
        if (record.isGroupHeader) {
          if (record.vendorName) {
            return (
              <div className="font-bold text-blue-600 flex items-center">
                <UserOutlined className="mr-2" />
                {record.vendorName}
              </div>
            );
          } else if (record.monthYear) {
            return (
              <div className="font-bold text-green-600 flex items-center">
                <CalendarOutlined className="mr-2" />
                {record.monthYear}
              </div>
            );
          }
        }
        return record.isGroupItem ? <span className="ml-4">{text}</span> : text;
      },
    },
    {
      title: 'Voucher Number',
      dataIndex: 'voucherNumber',
      key: 'voucherNumber',
      width: 150,
      render: (text, record) => {
        if (record.isGroupHeader) {
          return (
            <span className="text-gray-600">
              {record.paymentCount} payments
            </span>
          );
        }
        return text;
      },
    },
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: 200,
      render: (text, record) => {
        if (record.isGroupHeader && record.vendorName) {
          return null; // Already shown in date column
        }
        return record.isGroupHeader ? null : text;
      },
    },
    {
      title: 'Invoice/PO',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      width: 120,
      render: (text, record) => {
        if (record.isGroupHeader) return null;
        return (
          <div>
            <div>{text || 'N/A'}</div>
            <div className="text-xs text-gray-500">{record.poNumber || record.soNumber || ''}</div>
          </div>
        );
      },
    },
    {
      title: 'Type',
      dataIndex: 'paymentType',
      key: 'paymentType',
      width: 100,
      render: (text, record) => {
        if (record.isGroupHeader) return null;
        return text;
      },
    },
    {
      title: 'Paid Amount',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      width: 120,
      align: 'right',
      render: (amount, record) => {
        if (record.isGroupHeader) {
          return (
            <span className="font-bold text-green-600">
              ₹{record.totalAmount?.toLocaleString() || 0}
            </span>
          );
        }
        return `₹${amount?.toLocaleString() || 0}`;
      },
    },
    {
      title: 'Balance',
      dataIndex: 'balanceAmount',
      key: 'balanceAmount',
      width: 100,
      align: 'right',
      render: (balance, record) => {
        if (record.isGroupHeader) return null;
        return (
          <Tag color={balance > 0 ? 'red' : 'green'}>
            ₹{balance?.toLocaleString() || 0}
          </Tag>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status, record) => {
        if (record.isGroupHeader) return null;
        return (
          <Tag color={status === 'Paid' ? 'green' : 'orange'}>
            {status}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Payment Register</h1>
        <p className="text-gray-600">Chronological list of all payment vouchers</p>
      </div>

      {/* Filters */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={8}>
          <RangePicker
            onChange={handleDateRangeChange}
            format="DD/MM/YYYY"
            placeholder={['Start Date', 'End Date']}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} md={6}>
          <Select
            placeholder="Filter by vendor"
            style={{ width: '100%' }}
            allowClear
            onChange={setSelectedVendor}
            value={selectedVendor}
          >
            {vendors.map(vendor => (
              <Option key={vendor} value={vendor}>
                {vendor}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={6}>
          <Select
            placeholder="Group by"
            style={{ width: '100%' }}
            value={groupBy}
            onChange={setGroupBy}
          >
            <Option value="none">No Grouping</Option>
            <Option value="vendor">Group by Vendor</Option>
            <Option value="date">Group by Month</Option>
          </Select>
        </Col>
        <Col xs={24} md={4}>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={exportPaymentRegister}
            disabled={paymentData.length === 0}
            block
          >
            Export
          </Button>
        </Col>
      </Row>

      <Spin spinning={loading}>
        {/* Summary Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Total Payments"
                value={summary.totalPayments}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Total Amount"
                value={summary.totalAmount}
                precision={0}
                prefix={<DollarOutlined />}
                formatter={(value) => `₹${value?.toLocaleString() || 0}`}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Unique Vendors"
                value={summary.uniqueVendors}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Average Payment"
                value={summary.averagePayment}
                precision={0}
                prefix={<GroupOutlined />}
                formatter={(value) => `₹${value?.toLocaleString() || 0}`}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Payment Register Table */}
        <Card title="Payment Register" extra={`${filteredData.length} records`}>
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
            }}
            scroll={{ x: true }}
            size="small"
            rowClassName={(record) => {
              if (record.isGroupHeader) return 'bg-gray-50 font-bold';
              if (record.isGroupItem) return 'bg-blue-50';
              return '';
            }}
          />
        </Card>

        {paymentData.length === 0 && !loading && (
          <Card>
            <div className="text-center py-12">
              <CalendarOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Payment Data</h3>
              <p className="mt-2 text-gray-600">
                No payment vouchers found for the selected criteria.
              </p>
            </div>
          </Card>
        )}
      </Spin>
    </div>
  );
};

export default PaymentRegister;
