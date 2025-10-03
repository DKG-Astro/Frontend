import React, { useState } from 'react';
import { Form, Button, message, Card, Typography, Divider, Modal, Space, Alert, Tabs, Row, Col, Statistic } from 'antd';
import { FileTextOutlined, DownloadOutlined, ExportOutlined, BankOutlined, UserOutlined, SwapOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import CustomDatePicker from '../../components/DKG_CustomDatePicker';
import Btn from '../../components/DKG_Btn';
import TableComponent from '../../components/DKG_Table';
import { apiCall } from '../../utils/CommonFunctions';

const { Title, Text } = Typography;

const TallyIntegrationReport = () => {
  const { token } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  const [filter, setFilter] = useState({
    startDate: null,
    endDate: null,
  });

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [xmlContent, setXmlContent] = useState('');
  const [showXmlModal, setShowXmlModal] = useState(false);
  const [xmlLoading, setXmlLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('table');

  // Column definitions for payment voucher data - Optimized for both display and Excel export
  const columns = [
    {
      title: 'Voucher Number',
      dataIndex: 'paymentVoucherNumber',
      key: 'paymentVoucherNumber',
      filterable: true,
      width: 150
    },
    {
      title: 'Voucher Date',
      dataIndex: 'paymentVoucherDate',
      key: 'paymentVoucherDate',
      filterable: true,
      width: 120
    },
    {
      title: 'Voucher For',
      dataIndex: 'paymentVoucherIsFor',
      key: 'paymentVoucherIsFor',
      filterable: true,
      width: 130
    },
    {
      title: 'Type',
      dataIndex: 'paymentVoucherType',
      key: 'paymentVoucherType',
      filterable: true,
      width: 100
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      filterable: true,
      width: 150
    },
    {
      title: 'Vendor Invoice No.',
      dataIndex: 'vendorInvoiceNumber',
      key: 'vendorInvoiceNumber',
      filterable: true,
      width: 140
    },
    {
      title: 'Vendor Invoice Date',
      dataIndex: 'vendorInvoiceDate',
      key: 'vendorInvoiceDate',
      filterable: true,
      width: 140
    },
    {
      title: 'PO ID',
      dataIndex: 'purchaseOrderId',
      key: 'purchaseOrderId',
      filterable: true,
      width: 120
    },
    {
      title: 'SO ID',
      dataIndex: 'soId',
      key: 'soId',
      filterable: true,
      width: 120
    },
    {
      title: 'GRN Number',
      dataIndex: 'grnNumber',
      key: 'grnNumber',
      filterable: true,
      width: 120
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => (amount !== 'N/A' && typeof amount === 'number') ? `₹${amount.toLocaleString()}` : amount,
      width: 130
    },
    {
      title: 'Partial Amount',
      dataIndex: 'partialAmount',
      key: 'partialAmount',
      render: (amount) => (amount !== 'N/A' && typeof amount === 'number') ? `₹${amount.toLocaleString()}` : amount,
      width: 130
    },
    {
      title: 'Advance Amount',
      dataIndex: 'advanceAmount',
      key: 'advanceAmount',
      render: (amount) => (amount !== 'N/A' && typeof amount === 'number') ? `₹${amount.toLocaleString()}` : amount,
      width: 130
    },
    {
      title: 'Paid Amount',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      render: (amount) => (amount !== 'N/A' && typeof amount === 'number') ? `₹${amount.toLocaleString()}` : amount,
      width: 130
    },
    {
      title: 'Balance Amount',
      dataIndex: 'balanceAmount',
      key: 'balanceAmount',
      render: (amount) => (amount !== 'N/A' && typeof amount === 'number') ? `₹${amount.toLocaleString()}` : amount,
      width: 130
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      filterable: true,
      width: 100
    },
    {
      title: 'Exchange Rate',
      dataIndex: 'exchangeRate',
      key: 'exchangeRate',
      filterable: true,
      width: 120
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      filterable: true,
      width: 150
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100
    }
  ];

  const handleChange = (fieldName, value) => {
    setFilter((prev) => ({ ...prev, [fieldName]: value }));
  };

  const validateDates = () => {
    if (!filter.startDate || !filter.endDate) {
      message.error("Please select both start date and end date.");
      return false;
    }
    return true;
  };

  // Main function to fetch payment voucher data (like other reports)
  // Helper function to process data for Excel export with N/A handling and calculated fields
  const processDataForExport = (rawData) => {
    return rawData.map(record => {
      const processedRecord = { ...record };

      // Add calculated Balance Amount field
      const totalAmount = record.totalAmount || 0;
      const paidAmount = record.paidAmount || 0;
      processedRecord.balanceAmount = totalAmount - paidAmount;

      // Apply N/A handling for all fields
      processedRecord.paymentVoucherNumber = record.paymentVoucherNumber || 'N/A';
      processedRecord.paymentVoucherDate = record.paymentVoucherDate || 'N/A';
      processedRecord.paymentVoucherIsFor = record.paymentVoucherIsFor || 'N/A';
      processedRecord.paymentVoucherType = record.paymentVoucherType || 'N/A';
      processedRecord.vendorName = record.vendorName || 'N/A';
      processedRecord.vendorInvoiceNumber = record.vendorInvoiceNumber || 'N/A';
      processedRecord.vendorInvoiceDate = record.vendorInvoiceDate || 'N/A';
      processedRecord.purchaseOrderId = record.purchaseOrderId || 'N/A';
      processedRecord.soId = record.soId || 'N/A';
      processedRecord.grnNumber = record.grnNumber || 'N/A';

      // Format amounts with proper N/A handling
      processedRecord.totalAmount = (record.totalAmount !== null && record.totalAmount !== undefined) ? record.totalAmount : 'N/A';
      processedRecord.partialAmount = (record.partialAmount !== null && record.partialAmount !== undefined) ? record.partialAmount : 'N/A';
      processedRecord.advanceAmount = (record.advanceAmount !== null && record.advanceAmount !== undefined) ? record.advanceAmount : 'N/A';
      processedRecord.paidAmount = (record.paidAmount !== null && record.paidAmount !== undefined) ? record.paidAmount : 'N/A';
      processedRecord.balanceAmount = (record.totalAmount !== null && record.totalAmount !== undefined) ? processedRecord.balanceAmount : 'N/A';

      processedRecord.currency = record.currency || 'N/A';
      processedRecord.exchangeRate = (record.exchangeRate !== null && record.exchangeRate !== undefined && record.exchangeRate !== '' && record.exchangeRate !== '0') ? record.exchangeRate : 'N/A';
      processedRecord.remarks = record.remarks || 'N/A';
      processedRecord.createdDate = record.createdDate ? new Date(record.createdDate).toLocaleString() : 'N/A';
      processedRecord.createdBy = (record.createdBy !== null && record.createdBy !== undefined) ? record.createdBy.toString() : 'N/A';

      return processedRecord;
    });
  };

  const fetchPaymentVoucherData = async () => {
    if (!validateDates()) return;

    setLoading(true);
    try {
      const api = `/api/tally-integration/payment-vouchers?startDate=${filter.startDate}&endDate=${filter.endDate}`;
      const { data } = await apiCall('GET', api, token);

      if (data?.responseData?.responseData) {
        const rawData = data.responseData.responseData;
        const processedData = processDataForExport(rawData);
        setDataSource(processedData);
        message.success(`Successfully fetched ${rawData.length} payment vouchers`);
      } else {
        setDataSource([]);
        message.info("No payment voucher data found for the selected date range");
      }
    } catch (error) {
      message.error("Error fetching payment voucher data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Generate and preview Tally XML
  const previewTallyXML = async () => {
    if (!validateDates()) return;
    if (dataSource.length === 0) {
      message.warning("Please fetch payment voucher data first");
      return;
    }

    setXmlLoading(true);
    try {
      const api = `/api/tally-integration/generate-xml?startDate=${filter.startDate}&endDate=${filter.endDate}`;
      const { data } = await apiCall('POST', api, token);

      if (data?.responseData) {
        setXmlContent(data.responseData);
        setShowXmlModal(true);
        message.success("Tally XML generated successfully");
      } else {
        message.error("Failed to generate Tally XML");
      }
    } catch (error) {
      message.error("Error generating Tally XML");
      console.error(error);
    } finally {
      setXmlLoading(false);
    }
  };

  // Download Tally XML file
  const downloadTallyXML = async () => {
    if (!validateDates()) return;
    if (dataSource.length === 0) {
      message.warning("Please fetch payment voucher data first");
      return;
    }

    setXmlLoading(true);
    try {
      const api = `/api/tally-integration/generate-xml?startDate=${filter.startDate}&endDate=${filter.endDate}`;
      const { data } = await apiCall('POST', api, token);

      if (data?.responseData) {
        // Create and download XML file
        const xmlBlob = new Blob([data.responseData], { type: 'application/xml' });
        const url = window.URL.createObjectURL(xmlBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tally_payment_vouchers_${filter.startDate}_to_${filter.endDate}.xml`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        message.success("Tally XML file downloaded successfully");
      } else {
        message.error("Failed to generate Tally XML");
      }
    } catch (error) {
      message.error("Error downloading Tally XML");
      console.error(error);
    } finally {
      setXmlLoading(false);
    }
  };

  // Download Tally-compatible Excel file
  const downloadTallyExcel = async () => {
    if (!validateDates()) return;
    if (dataSource.length === 0) {
      message.warning("Please fetch payment voucher data first");
      return;
    }

    setXmlLoading(true);
    try {
      // Transform data for Tally Excel import format
      const tallyExcelData = dataSource.map((record, index) => {
        const paymentAmount = record.paidAmount !== 'N/A' && typeof record.paidAmount === 'number'
          ? record.paidAmount
          : (record.partialAmount !== 'N/A' && typeof record.partialAmount === 'number'
              ? record.partialAmount
              : (record.advanceAmount !== 'N/A' && typeof record.advanceAmount === 'number'
                  ? record.advanceAmount
                  : record.totalAmount));

        return {
          'Voucher Type': 'Payment',
          'Voucher Number': record.paymentVoucherNumber || `PV${String(index + 1).padStart(3, '0')}`,
          'Date': record.paymentVoucherDate || '',
          'Ledger Name': record.vendorName || 'Unknown Vendor',
          'Amount': paymentAmount || 0,
          'Dr/Cr': 'Cr',
          'Narration': `Payment for ${record.paymentVoucherIsFor || 'Purchase'} - PO: ${record.purchaseOrderId || 'N/A'} - Invoice: ${record.vendorInvoiceNumber || 'N/A'}`,
          'Reference': record.vendorInvoiceNumber || '',
          'Bank Ledger': 'Bank Account',
          'Bank Amount': paymentAmount || 0,
          'Bank Dr/Cr': 'Dr'
        };
      });

      // Create Excel workbook with multiple sheets
      const XLSX = await import('xlsx');
      const workbook = XLSX.utils.book_new();

      // Sheet 1: Tally Import Format
      const tallySheet = XLSX.utils.json_to_sheet(tallyExcelData);
      XLSX.utils.book_append_sheet(workbook, tallySheet, "Tally Import Format");

      // Sheet 2: Voucher Details (for reference)
      const detailsData = dataSource.map(record => ({
        'Voucher Number': record.paymentVoucherNumber,
        'Date': record.paymentVoucherDate,
        'Vendor': record.vendorName,
        'Invoice Number': record.vendorInvoiceNumber,
        'PO ID': record.purchaseOrderId,
        'SO ID': record.soId,
        'Total Amount': record.totalAmount,
        'Paid Amount': record.paidAmount,
        'Balance Amount': record.balanceAmount,
        'Currency': record.currency,
        'Exchange Rate': record.exchangeRate,
        'Remarks': record.remarks
      }));
      const detailsSheet = XLSX.utils.json_to_sheet(detailsData);
      XLSX.utils.book_append_sheet(workbook, detailsSheet, "Voucher Details");

      // Sheet 3: Import Instructions
      const instructionsData = [
        { 'Step': 1, 'Instruction': 'Open Tally.ERP 9 or TallyPrime' },
        { 'Step': 2, 'Instruction': 'Go to Gateway of Tally > Import Data > Excel' },
        { 'Step': 3, 'Instruction': 'Select this Excel file' },
        { 'Step': 4, 'Instruction': 'Map columns: Voucher Type, Date, Ledger Name, Amount, Dr/Cr' },
        { 'Step': 5, 'Instruction': 'Ensure "Create if not exists" is enabled for ledgers' },
        { 'Step': 6, 'Instruction': 'Click Import to create payment vouchers' },
        { 'Step': 7, 'Instruction': 'Verify vouchers in Display > Account Books > Payment Register' }
      ];
      const instructionsSheet = XLSX.utils.json_to_sheet(instructionsData);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Import Instructions");

      // Download the file
      XLSX.writeFile(workbook, `tally_payment_vouchers_excel_${filter.startDate}_to_${filter.endDate}.xlsx`);

      message.success("Tally Excel file downloaded successfully");
    } catch (error) {
      message.error("Error downloading Tally Excel file");
      console.error(error);
    } finally {
      setXmlLoading(false);
    }
  };



  const resetForm = () => {
    setFilter({ startDate: null, endDate: null });
    setDataSource([]);
    setXmlContent('');
    setShowXmlModal(false);
    setActiveTab('table');
    form.resetFields();
  };

  // Render accounting view for a single voucher
  const renderAccountingEntry = (record) => {
    const paymentAmount = record.paidAmount !== 'N/A' && typeof record.paidAmount === 'number'
      ? record.paidAmount
      : (record.partialAmount !== 'N/A' && typeof record.partialAmount === 'number'
          ? record.partialAmount
          : (record.advanceAmount !== 'N/A' && typeof record.advanceAmount === 'number'
              ? record.advanceAmount
              : (typeof record.totalAmount === 'number' ? record.totalAmount : 0)));

    const totalAmount = typeof record.totalAmount === 'number' ? record.totalAmount : 0;
    const balanceAmount = totalAmount - paymentAmount;

    return (
      <Card key={record.paymentVoucherNumber} className="mb-4" size="small">
        <div className="mb-3">
          <h4 className="text-lg font-semibold">{record.paymentVoucherNumber}</h4>
          <p className="text-gray-600">{record.paymentVoucherDate} - {record.vendorName}</p>
        </div>

        {/* T-Account Visual */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col span={12}>
            <Card size="small" className="text-center" style={{ backgroundColor: '#fff2e8', borderColor: '#ffa940' }}>
              <UserOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
              <h5 className="mt-2 mb-1">{record.vendorName}</h5>
              <p className="text-sm text-gray-600">Vendor Account</p>
              <Statistic
                title="CREDIT"
                value={paymentAmount}
                precision={0}
                valueStyle={{ color: '#fa8c16', fontSize: '16px' }}
                formatter={(value) => `₹${value?.toLocaleString() || 0}`}
              />
              <p className="text-xs text-gray-500 mt-1">Liability Reduced</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" className="text-center" style={{ backgroundColor: '#f6ffed', borderColor: '#52c41a' }}>
              <BankOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
              <h5 className="mt-2 mb-1">Bank Account</h5>
              <p className="text-sm text-gray-600">Bank Account</p>
              <Statistic
                title="DEBIT"
                value={paymentAmount}
                precision={0}
                valueStyle={{ color: '#52c41a', fontSize: '16px' }}
                formatter={(value) => `₹${value?.toLocaleString() || 0}`}
              />
              <p className="text-xs text-gray-500 mt-1">Asset Reduced</p>
            </Card>
          </Col>
        </Row>

        {/* Balance Impact */}
        <Card size="small" style={{ backgroundColor: '#f0f5ff', borderColor: '#1890ff' }}>
          <h6 className="mb-2 flex items-center">
            <SwapOutlined className="mr-2" />
            Impact on Balances
          </h6>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <div className="flex justify-between items-center py-1">
                <span>Vendor Balance:</span>
                <span>
                  <span className="text-gray-500">₹{totalAmount?.toLocaleString() || 0}</span>
                  <span className="mx-2">→</span>
                  <span className="font-semibold text-blue-600">₹{balanceAmount?.toLocaleString() || 0}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    (Reduced by ₹{paymentAmount?.toLocaleString() || 0})
                  </span>
                </span>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Transaction Details */}
        <div className="mt-3 p-3 bg-gray-50 rounded">
          <h6 className="mb-2 font-medium">Transaction Details:</h6>
          <Row gutter={[16, 8]} className="text-sm">
            <Col span={12}>
              <div><strong>Invoice:</strong> {record.vendorInvoiceNumber || 'N/A'}</div>
              <div><strong>PO/SO:</strong> {record.purchaseOrderId || record.soId || 'N/A'}</div>
            </Col>
            <Col span={12}>
              <div><strong>Type:</strong> {record.paymentVoucherType || 'Payment'}</div>
              <div><strong>Currency:</strong> {record.currency || 'INR'}</div>
            </Col>
          </Row>
          {record.remarks && record.remarks !== 'N/A' && (
            <div className="mt-2">
              <strong>Remarks:</strong> {record.remarks}
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div>
      <Title level={3} className="text-center mb-8">Tally Integration Report</Title>

      {/* Date Filter Form - Following standard report pattern */}
      <Form
        form={form}
        onFinish={fetchPaymentVoucherData}
        className="grid md:grid-cols-4 grid-cols-2 gap-x-2 items-center px-2 pt-0 border !py-4 border-darkBlueHover mb-8"
      >
        <CustomDatePicker
          className="no-margin"
          defaultValue={filter.startDate}
          placeholder="From date"
          name="startDate"
          onChange={handleChange}
          required
        />
        <CustomDatePicker
          className="no-margin"
          defaultValue={filter.endDate}
          placeholder="To date"
          name="endDate"
          onChange={handleChange}
          required
        />

        <Btn htmlType="submit" className="w-full" loading={loading}>
          Search
        </Btn>

        <Button
          className="flex gap-2 items-center border-darkBlue text-darkBlue"
          onClick={resetForm}
        >
          Reset
        </Button>
      </Form>



      {/* Tally Integration Actions */}
      {dataSource.length > 0 && (
        <>
          <Divider />
          <Title level={4}>Tally Integration</Title>
       { /*  <Alert
            message="Tally Integration Options"
            description={
              <div>
                <p><strong>Choose Your Preferred Import Method:</strong></p>
                <ul>
                  <li><strong>XML Import:</strong> Standard Tally XML format (Gateway → Import Data → XML Data Files)</li>
                  <li><strong>Excel Import:</strong> Excel format for Tally import (Gateway → Import Data → Excel)</li>
                  <li><strong>Preview XML:</strong> Review the XML structure before download</li>
                  <li><strong>Reference Excel:</strong> Standard Excel export for analysis (not for Tally import)</li>
                </ul>
                <p><strong>Recommended:</strong> Use Excel Import for easier column mapping and data verification</p>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
*/}
          <Space size="middle" style={{ marginBottom: 24 }} wrap>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={downloadTallyExcel}
              loading={xmlLoading}
              size="large"
            >
              Download Tally Excel
            </Button>

            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={downloadTallyXML}
              loading={xmlLoading}
            >
              Download Tally XML
            </Button>

            <Button
              type="default"
              icon={<FileTextOutlined />}
              onClick={previewTallyXML}
              loading={xmlLoading}
            >
              Preview XML
            </Button>

            <Button
              type="default"
              icon={<ExportOutlined />}
              onClick={() => {
                message.info("Use the 'Export to CSV' button in the table below for reference data export");
              }}
            >
              Reference Excel
            </Button>
          </Space>
        </>
      )}

      {/* Payment Voucher Data with Tabs */}
      {dataSource.length > 0 && (
        <>
          <Title level={4}>Payment Voucher Data ({dataSource.length} records)</Title>
          <Text className="block mb-4 text-gray-600">
            View payment voucher data in table format or accounting entries format for better understanding.
          </Text>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'table',
                label: 'Table View',
                children: (
                  <TableComponent
                    dataSource={dataSource}
                    columns={columns}
                    expandable={{
                      expandedRowRender: (record) => (
                        <div className="p-4 bg-gray-50">
                          <Title level={5}>Material Details for Voucher: {record.paymentVoucherNumber}</Title>
                          {record.materials && record.materials.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {record.materials.map((material, index) => (
                                <Card key={index} size="small" className="border">
                                  <div className="space-y-2">
                                    <div><strong>Code:</strong> {material.materialCode || 'N/A'}</div>
                                    <div><strong>Description:</strong> {material.materialDescription || 'N/A'}</div>
                                    <div><strong>Quantity:</strong> {material.quantity !== null && material.quantity !== undefined ? material.quantity : 'N/A'}</div>
                                    <div><strong>Unit Price:</strong> {material.unitPrice !== null && material.unitPrice !== undefined ? `₹${material.unitPrice.toLocaleString()}` : 'N/A'}</div>
                                    <div><strong>Currency:</strong> {material.currency || 'N/A'}</div>
                                    <div><strong>Exchange Rate:</strong> {(material.exchangeRate !== null && material.exchangeRate !== undefined && material.exchangeRate !== 0) ? material.exchangeRate : 'N/A'}</div>
                                    <div><strong>GST:</strong> {material.gst !== null && material.gst !== undefined ? `${material.gst}%` : 'N/A'}</div>
                                    <div className="pt-2 border-t">
                                      <strong>Material Total:</strong> {(material.quantity !== null && material.quantity !== undefined && material.unitPrice !== null && material.unitPrice !== undefined) ? `₹${((material.quantity || 0) * (material.unitPrice || 0)).toLocaleString()}` : 'N/A'}
                                    </div>
                                    <div>
                                      <strong>GST Amount:</strong> {(material.quantity !== null && material.quantity !== undefined && material.unitPrice !== null && material.unitPrice !== undefined && material.gst !== null && material.gst !== undefined) ? `₹${(((material.quantity || 0) * (material.unitPrice || 0)) * ((material.gst || 0) / 100)).toLocaleString()}` : 'N/A'}
                                    </div>
                                    <div className="font-semibold text-blue-600">
                                      <strong>Total with GST:</strong> {(material.quantity !== null && material.quantity !== undefined && material.unitPrice !== null && material.unitPrice !== undefined) ? `₹${(((material.quantity || 0) * (material.unitPrice || 0)) * (1 + ((material.gst || 0) / 100))).toLocaleString()}` : 'N/A'}
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <Text type="secondary">No material details available</Text>
                          )}
                        </div>
                      ),
                      rowExpandable: (record) => record.materials && record.materials.length > 0,
                    }}
                  />
                )
              },
              {
                key: 'accounting',
                label: 'Accounting View',
                children: (
                  <div className="max-h-96 overflow-y-auto">
                    {dataSource.map(record => renderAccountingEntry(record))}
                  </div>
                )
              }
            ]}
          />
        </>
      )}

      {/* XML Preview Modal */}
      <Modal
        title="Tally XML Preview"
        open={showXmlModal}
        onCancel={() => setShowXmlModal(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setShowXmlModal(false)}>
            Close
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => {
              setShowXmlModal(false);
              downloadTallyXML();
            }}
          >
            Download This XML
          </Button>
        ]}
      >
        <div style={{ maxHeight: '500px', overflow: 'auto' }}>
          <pre style={{
            background: '#f5f5f5',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '12px',
            lineHeight: '1.4'
          }}>
            {xmlContent}
          </pre>
        </div>
      </Modal>

    </div>
  );
};

export default TallyIntegrationReport;
