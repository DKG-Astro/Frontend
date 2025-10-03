import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, DatePicker, message, Spin } from 'antd';
import { 
  DollarOutlined, 
  TeamOutlined, 
  CalendarOutlined, 
  BankOutlined,
  RiseOutlined,
  FileTextOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { Line } from '@ant-design/plots';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../utils/CommonFunctions';

const { RangePicker } = DatePicker;

const AccountingDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalPayments: 0,
    activeVendors: 0,
    thisMonthPayments: 0,
    outstandingBalance: 0,
    recentVouchers: [],
    paymentTrends: []
  });
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (startDate = null, endDate = null) => {
    setLoading(true);
    try {
      // For now, we'll use the existing Tally Integration API to get payment voucher data
      // and calculate dashboard metrics on the frontend
      const currentDate = new Date();
      const defaultStartDate = startDate || `01/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
      const defaultEndDate = endDate || `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
      
      const api = `/api/tally-integration/payment-vouchers?startDate=${defaultStartDate}&endDate=${defaultEndDate}`;
      const { data } = await apiCall('GET', api, token);

      if (data?.responseData?.responseData) {
        const vouchers = data.responseData.responseData;
        calculateDashboardMetrics(vouchers);
      } else {
        setDashboardData({
          totalPayments: 0,
          activeVendors: 0,
          thisMonthPayments: 0,
          outstandingBalance: 0,
          recentVouchers: [],
          paymentTrends: []
        });
      }
    } catch (error) {
      message.error("Error fetching dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDashboardMetrics = (vouchers) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Calculate total payments (only positive amounts)
    const totalPayments = vouchers.reduce((sum, voucher) => {
      const amount = voucher.paidAmount || voucher.partialAmount || voucher.advanceAmount || voucher.totalAmount || 0;
      return sum + (amount > 0 ? amount : 0); // Only add positive amounts
    }, 0);

    // Calculate active vendors (unique vendor count)
    const uniqueVendors = new Set(vouchers.map(v => v.vendorName).filter(Boolean));
    const activeVendors = uniqueVendors.size;

    // Calculate this month's payments (only positive amounts)
    const thisMonthPayments = vouchers.reduce((sum, voucher) => {
      if (voucher.paymentVoucherDate) {
        try {
          const dateParts = voucher.paymentVoucherDate.split('/');
          if (dateParts.length === 3) {
            const voucherDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
            if (!isNaN(voucherDate.getTime()) &&
                voucherDate.getMonth() === currentMonth &&
                voucherDate.getFullYear() === currentYear) {
              const amount = voucher.paidAmount || voucher.partialAmount || voucher.advanceAmount || voucher.totalAmount || 0;
              return sum + (amount > 0 ? amount : 0); // Only add positive amounts
            }
          }
        } catch (error) {
          // Skip invalid dates
        }
      }
      return sum;
    }, 0);

    // Calculate outstanding balance (total - paid amounts)
    const outstandingBalance = vouchers.reduce((sum, voucher) => {
      const totalAmount = voucher.totalAmount || 0;
      const paidAmount = voucher.paidAmount || 0;
      return sum + (totalAmount - paidAmount);
    }, 0);

    // Get recent vouchers (last 10) - only positive amounts
    const recentVouchers = vouchers
      .filter(voucher => {
        const amount = voucher.paidAmount || voucher.partialAmount || voucher.advanceAmount || voucher.totalAmount || 0;
        return amount > 0; // Only include vouchers with positive amounts
      })
      .sort((a, b) => {
        try {
          const datePartsA = a.paymentVoucherDate?.split('/') || [];
          const datePartsB = b.paymentVoucherDate?.split('/') || [];

          if (datePartsA.length === 3 && datePartsB.length === 3) {
            const dateA = new Date(`${datePartsA[2]}-${datePartsA[1]}-${datePartsA[0]}`);
            const dateB = new Date(`${datePartsB[2]}-${datePartsB[1]}-${datePartsB[0]}`);

            if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
              return dateB - dateA; // Most recent first
            }
          }
          return 0;
        } catch (error) {
          return 0;
        }
      })
      .slice(0, 10)
      .map(voucher => ({
        key: voucher.paymentVoucherNumber,
        voucherNumber: voucher.paymentVoucherNumber,
        date: voucher.paymentVoucherDate,
        vendor: voucher.vendorName,
        amount: voucher.paidAmount || voucher.partialAmount || voucher.advanceAmount || voucher.totalAmount || 0,
        type: voucher.paymentVoucherType || 'Payment'
      }));

    // Calculate payment trends (monthly aggregation) - Only positive amounts
    const monthlyTrends = {};
    let processedVouchers = 0;
    let skippedVouchers = 0;

    vouchers.forEach(voucher => {
      if (voucher.paymentVoucherDate) {
        try {
          // Handle DD/MM/YYYY format
          const dateParts = voucher.paymentVoucherDate.split('/');
          if (dateParts.length === 3) {
            const voucherDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

            // Check if date is valid
            if (!isNaN(voucherDate.getTime())) {
              // Get the best available amount (priority: paid > partial > advance > total)
              const amount = voucher.paidAmount || voucher.partialAmount || voucher.advanceAmount || voucher.totalAmount || 0;

              // Only include positive amounts (filter out negative and zero values)
              if (amount > 0) {
                const monthKey = `${voucherDate.getFullYear()}-${String(voucherDate.getMonth() + 1).padStart(2, '0')}`;

                if (!monthlyTrends[monthKey]) {
                  monthlyTrends[monthKey] = {
                    totalAmount: 0,
                    voucherCount: 0,
                    year: voucherDate.getFullYear(),
                    month: voucherDate.getMonth() + 1
                  };
                }

                monthlyTrends[monthKey].totalAmount += amount;
                monthlyTrends[monthKey].voucherCount += 1;
                processedVouchers++;
              } else {
                skippedVouchers++;
              }
            }
          }
        } catch (error) {
          console.warn('Error processing voucher date:', voucher.paymentVoucherDate, error);
          skippedVouchers++;
        }
      } else {
        skippedVouchers++;
      }
    });

    console.log('Payment Trends Debug:', {
      totalVouchers: vouchers.length,
      processedVouchers,
      skippedVouchers,
      monthsWithData: Object.keys(monthlyTrends).length,
      monthlyTrends
    });

    // Convert to chart data format with proper month display
    const paymentTrends = Object.entries(monthlyTrends)
      .map(([monthKey, data]) => {
        const [year, month] = monthKey.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);

        return {
          month: monthKey, // Keep original for sorting
          monthDisplay: date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
          }), // "Jan 2024" format
          amount: Math.round(data.totalAmount), // Ensure positive integers only
          voucherCount: data.voucherCount,
          sortDate: date.getTime() // For proper chronological sorting
        };
      })
      .filter(item => item.amount > 0) // Double-check: only positive amounts
      .sort((a, b) => a.sortDate - b.sortDate); // Sort chronologically

    // Additional debugging for chart data
    console.log('Chart Data Debug:', {
      paymentTrendsArray: paymentTrends,
      dataLength: paymentTrends.length,
      sampleData: paymentTrends[0],
      xFieldValues: paymentTrends.map(item => item.monthDisplay),
      yFieldValues: paymentTrends.map(item => item.amount)
    });

    setDashboardData({
      totalPayments,
      activeVendors,
      thisMonthPayments,
      outstandingBalance,
      recentVouchers,
      paymentTrends
    });
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0].format('DD/MM/YYYY');
      const endDate = dates[1].format('DD/MM/YYYY');
      fetchDashboardData(startDate, endDate);
    } else {
      fetchDashboardData();
    }
  };

  const recentVouchersColumns = [
    {
      title: 'Voucher Number',
      dataIndex: 'voucherNumber',
      key: 'voucherNumber',
      width: 150,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
      ellipsis: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount) => `₹${amount?.toLocaleString() || 0}`,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
  ];

  // Enhanced chart configuration for proper display
  const chartConfig = {
    data: dashboardData.paymentTrends,
    xField: 'monthDisplay', // Use formatted month display
    yField: 'amount',

    // Chart styling - optimized for single and multiple data points
    smooth: dashboardData.paymentTrends.length > 1, // Only smooth if multiple points
    color: '#1890ff',
    lineStyle: {
      lineWidth: dashboardData.paymentTrends.length === 1 ? 0 : 3, // No line for single point
    },

    // Data points - enhanced for visibility
    point: {
      size: dashboardData.paymentTrends.length === 1 ? 10 : 6, // Larger point for single data
      shape: 'circle',
      style: {
        fill: '#1890ff',
        stroke: '#ffffff',
        lineWidth: 2,
        cursor: 'pointer',
      },
    },

    // X-Axis configuration
    xAxis: {
      title: {
        text: 'Month',
        style: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      },
      label: {
        autoRotate: dashboardData.paymentTrends.length > 6,
        autoHide: false,
        style: {
          fontSize: 11,
          fill: '#666',
        },
      },
      grid: {
        line: {
          style: {
            stroke: '#f0f0f0',
            lineWidth: 1,
          },
        },
      },
    },

    // Y-Axis configuration - Only positive values
    yAxis: {
      min: 0, // Force Y-axis to start at 0
      nice: true, // Auto-adjust scale for better appearance
      title: {
        text: 'Payment Amount (₹)',
        style: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      },
      label: {
        formatter: (value) => {
          // Format large numbers with K/L notation
          if (value >= 10000000) { // 1 Crore
            return `₹${(value / 10000000).toFixed(1)}Cr`;
          } else if (value >= 100000) { // 1 Lakh
            return `₹${(value / 100000).toFixed(1)}L`;
          } else if (value >= 1000) { // 1 Thousand
            return `₹${(value / 1000).toFixed(1)}K`;
          } else {
            return `₹${value?.toLocaleString() || 0}`;
          }
        },
        style: {
          fontSize: 11,
          fill: '#666',
        },
      },
      grid: {
        line: {
          style: {
            stroke: '#f0f0f0',
            lineWidth: 1,
          },
        },
      },
    },

    // Simplified tooltip configuration
    tooltip: {
      formatter: (datum) => {
        return {
          name: 'Payment Amount',
          value: `₹${(datum?.amount || 0).toLocaleString()}`,
        };
      },
    },

    // Animation
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Accounting Dashboard</h1>
        <p className="text-gray-600">Overview of payment vouchers and financial metrics</p>
      </div>

      {/* Date Range Filter */}
      <div className="mb-6">
        <RangePicker
          onChange={handleDateRangeChange}
          format="DD/MM/YYYY"
          placeholder={['Start Date', 'End Date']}
        />
      </div>

      <Spin spinning={loading}>
        {/* Summary Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Payments"
                value={dashboardData.totalPayments}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
                prefix={<DollarOutlined />}
                formatter={(value) => `₹${value?.toLocaleString() || 0}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Vendors"
                value={dashboardData.activeVendors}
                valueStyle={{ color: '#1890ff' }}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="This Month"
                value={dashboardData.thisMonthPayments}
                precision={0}
                valueStyle={{ color: '#722ed1' }}
                prefix={<CalendarOutlined />}
                formatter={(value) => `₹${value?.toLocaleString() || 0}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Outstanding Balance"
                value={dashboardData.outstandingBalance}
                precision={0}
                valueStyle={{ color: dashboardData.outstandingBalance > 0 ? '#cf1322' : '#3f8600' }}
                prefix={<BankOutlined />}
                formatter={(value) => `₹${value?.toLocaleString() || 0}`}
              />
            </Card>
          </Col>
        </Row>

        {/* Charts and Tables Row */}
        <Row gutter={[16, 16]}>
          {/* Payment Trends Chart */}
          <Col xs={24} lg={14}>
            <Card
              title={
                <div className="flex items-center justify-between">
                  <span>Payment Trends</span>
                  <span className="text-sm font-normal text-gray-500">
                    {dashboardData.paymentTrends.length > 0
                      ? `${dashboardData.paymentTrends.length} month${dashboardData.paymentTrends.length !== 1 ? 's' : ''}`
                      : 'No data'
                    }
                  </span>
                </div>
              }
              extra={<RiseOutlined style={{ color: '#1890ff' }} />}
              className="h-full"
            >
              {dashboardData.paymentTrends.length > 0 ? (
                <div className="w-full">
                  {/* Debug info - remove in production */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mb-2 text-xs text-gray-500">
                      Debug: {JSON.stringify(dashboardData.paymentTrends, null, 2)}
                    </div>
                  )}

                  {/* Chart container with proper sizing */}
                  <div
                    style={{
                      width: '100%',
                      height: '380px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Line
                      {...chartConfig}
                      height={380}
                      autoFit={true}
                      padding={[30, 30, 80, 90]} // top, right, bottom, left - more space for labels
                    />
                  </div>

                  {/* Chart summary */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-gray-600 mb-1">Total Months</div>
                        <div className="text-lg font-semibold text-blue-600">
                          {dashboardData.paymentTrends.length}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600 mb-1">Highest Payment</div>
                        <div className="text-lg font-semibold text-green-600">
                          ₹{Math.max(...dashboardData.paymentTrends.map(t => t.amount)).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600 mb-1">Average Payment</div>
                        <div className="text-lg font-semibold text-purple-600">
                          ₹{Math.round(
                            dashboardData.paymentTrends.reduce((sum, t) => sum + t.amount, 0) /
                            dashboardData.paymentTrends.length
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <RiseOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
                  <h3 className="mt-6 text-xl font-medium text-gray-900">No Payment Trends Available</h3>
                  <p className="mt-3 text-gray-600 max-w-md mx-auto">
                    No positive payment amounts found for the selected date range.
                    <br />
                    <span className="text-sm">
                      • Try selecting a different date range<br />
                      • Verify that payment vouchers exist with positive amounts<br />
                      • Check that payment dates are in DD/MM/YYYY format
                    </span>
                  </p>
                  <div className="mt-4 text-xs text-gray-500">
                    Only payments with positive amounts are included in trends
                  </div>
                </div>
              )}
            </Card>
          </Col>

          {/* Quick Actions */}
          <Col xs={24} lg={10}>
            <Card title="Quick Actions">
              <div className="space-y-3">
                <Button
                  type="primary"
                  icon={<FileTextOutlined />}
                  block
                  onClick={() => navigate('/reports/tally-integration')}
                >
                  Tally Integration Report
                </Button>
                <Button
                  icon={<EyeOutlined />}
                  block
                  onClick={() => navigate('/accounting/vendor-ledger')}
                >
                  View Vendor Ledgers
                </Button>
                <Button
                  icon={<BankOutlined />}
                  block
                  onClick={() => navigate('/accounting/trial-balance')}
                >
                  Trial Balance
                </Button>
                <Button
                  icon={<CalendarOutlined />}
                  block
                  onClick={() => navigate('/accounting/payment-register')}
                >
                  Payment Register
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Recent Vouchers Table */}
        <Row className="mt-6">
          <Col span={24}>
            <Card title="Recent Payment Vouchers" extra={`${dashboardData.recentVouchers.length} vouchers`}>
              <Table
                columns={recentVouchersColumns}
                dataSource={dashboardData.recentVouchers}
                pagination={false}
                size="small"
                scroll={{ x: true }}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default AccountingDashboard;
