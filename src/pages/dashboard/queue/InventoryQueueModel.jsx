import React, { useState, useEffect } from "react";
import { Modal, Typography, Row, Col, Table, Button, Spin, Tag } from "antd";
import { HistoryOutlined, BarsOutlined,ProjectOutlined } from "@ant-design/icons";
import axios from "axios";
import { baseURL } from '../../../App';

const InventoryQueueModal = ({
  modalVisible,
  setModalVisible,
  selectedRecord,
  detailsData,
  type,
  loading,
}) => {
  const [historyVisible, setHistoryVisible] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const giDtls = detailsData?.giDtls || {};
  const gprnDtls = detailsData?.gprnDtls || {};

  const processNo = `INV${giDtls.gprnProcessId}/${giDtls.inspectionSubProcessId}`;
  const titleText = type === "GI" ? giDtls.inspectionNo : gprnDtls.processId;
  const materialDtlList = type === "GI" ? giDtls.materialDtlList : gprnDtls.materialDtlList;

  const fetchHistory = async () => {
     const giNo = giDtls.inspectionNo;
    if (!giNo) return;
    const [processId, subProcessId] = giNo.split("/");
    setHistoryLoading(true);
    try {
      const response = await axios.get(
        `/api/process-controller/giHistory`,
        {
          params: {
            processId: `${processId}`,
            subProcessId: subProcessId,
          },
        }
      );
      const historyData = Array.isArray(response?.data?.responseData)
        ? response.data.responseData
        : [];
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching history:", error);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (historyVisible) {
      fetchHistory();
    }
  }, [historyVisible]);

  // Build Warranty Map OUTSIDE JSX
const warrantyMap = {};
(gprnDtls.materialDtlList || []).forEach(item => {
  warrantyMap[item.materialCode] = item.warrantyTerms;
});

  return (
    <>
      <Modal
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{titleText || "Inventory Details"}</span>
            <Button type="link" icon={<HistoryOutlined />} onClick={() => setHistoryVisible(true)}>
              View History
            </Button>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
        bodyStyle={{ padding: "24px" }}
      >
        <Spin spinning={loading}>
          <style>{`
            .detail-section { margin-bottom: 24px; padding: 16px; border: 1px solid #f0f0f0; border-radius: 8px; }
            .detail-item { margin-bottom: 12px; font-size: 14px; }
            .detail-item strong { display: inline-block; width: 200px; }
            .section-title { font-size: 16px; font-weight: 500; margin-bottom: 12px; }
          `}</style>

          {type === "GI" && (
            <div className="detail-section">
              <Typography.Title level={5} className="section-title">GI Details</Typography.Title>
              <Row gutter={24}>
                <Col span={12}>
                  <div className="detail-item"><strong>GI No:</strong> {giDtls.inspectionNo || "N/A"}</div>
                  <div className="detail-item"><strong>Installation Date:</strong> {giDtls.installationDate || "N/A"}</div>
                    <div className="detail-item"><strong>Commissioning Date:</strong> {giDtls.commissioningDate || "N/A"}</div>
                </Col>
                <Col span={12}>
                
                   <div className="detail-item"><strong>Po Amount:</strong> {giDtls.poAmount || "N/A"}</div>
                    <div className="detail-item"><strong>Gprn Amount:</strong> {giDtls.gprnAmount || "N/A"}</div>
                  {giDtls.installationReportFileName && (
  <div className="detail-section">
    <Typography.Title level={5} className="section-title">
      <ProjectOutlined /> Installation Report
    </Typography.Title>
    <Row gutter={24}>
      <Col span={12}>
        <div className="detail-item">
          <strong>Installation Report:</strong>{" "}
          {giDtls.installationReportFileName
            ? giDtls.installationReportFileName
                .split(",")
                .map((fileName, index) => (
                  <div key={index}>
                    <a
                      href={`${baseURL}/file/view/INV/${fileName.trim()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {fileName.trim()} (View)
                    </a>
                    {index <
                      giDtls.installationReportFileName.split(", ").length - 1 && ", "}
                  </div>
                ))
            : "N/A"}
        </div>
      </Col>
    </Row>
  </div>
)}

                </Col>
              </Row>

              <div className="detail-section">
                <Typography.Title level={5} className="section-title">Gprn Details</Typography.Title>
                <Row gutter={24}>
                  <Col span={12}><div className="detail-item"><strong>GPRN No:</strong> {gprnDtls.processId || "N/A"}</div></Col>
                  <Col span={12}><div className="detail-item"><strong>PO ID:</strong> {gprnDtls.poId || "N/A"}</div></Col>
                  <Col span={12}><div className="detail-item"><strong>Date:</strong> {gprnDtls.date || "N/A"}</div></Col>
                </Row>
              </div>

              <div className="detail-section">
                <Typography.Title level={5} className="section-title">Vendor Details</Typography.Title>
                <Row gutter={24}>
                  <Col span={12}><div className="detail-item"><strong>Vendor ID:</strong> {gprnDtls.vendorId || "N/A"}</div></Col>
                  <Col span={12}><div className="detail-item"><strong>Vendor Name:</strong> {gprnDtls.vendorName || "N/A"}</div></Col>
                  <Col span={12}><div className="detail-item"><strong>Email:</strong> {gprnDtls.vendorEmail || "N/A"}</div></Col>
                  <Col span={12}><div className="detail-item"><strong>Contact:</strong> {gprnDtls.vendorContact || "N/A"}</div></Col>
                </Row>
              </div>

              <div className="detail-section">
                <Typography.Title level={5} className="section-title">Delivery & Invoice</Typography.Title>
                <Row gutter={24}>
                  <Col span={12}><div className="detail-item"><strong>Challan No:</strong> {gprnDtls.challanNo || "N/A"}</div></Col>
                  <Col span={12}><div className="detail-item"><strong>Delivery Date:</strong> {gprnDtls.deliveryDate || "N/A"}</div></Col>
                  <Col span={12}><div className="detail-item"><strong>Supply Expected Date:</strong> {gprnDtls.supplyExpectedDate || "N/A"}</div></Col>
                  <Col span={12}><div className="detail-item"><strong>Field Station:</strong> {gprnDtls.fieldStation || "N/A"}</div></Col>
                  <Col span={12}><div className="detail-item"><strong>Indentor Name:</strong> {gprnDtls.indentorName || "N/A"}</div></Col>
                </Row>
              </div>
              <div>
                
              </div>

              <div className="detail-section">
                <Typography.Title level={5} className="section-title">Consignee & Warranty</Typography.Title>
                <Row gutter={24}>
                  <Col span={12}><div className="detail-item"><strong>Consignee Details:</strong> {gprnDtls.consigneeDetail || "N/A"}</div></Col>
                   <Col span={12}><div className="detail-item"><strong>Project:</strong> {gprnDtls.project || "N/A"}</div></Col>
                </Row>
              </div>
            </div>
          )}
        


          <div className="detail-section">
            <Typography.Title level={5} className="section-title">
              <BarsOutlined /> Material Details
            </Typography.Title>
  
            <Table
              dataSource={materialDtlList || []}
              pagination={false}
              bordered
              rowKey="materialCode"
              scroll={{ x: "max-content" }}
              columns={
                type === "GI"
                  ? [
                      { title: "Material Code", dataIndex: "materialCode" },
                      { title: "Description", dataIndex: "materialDesc" },
                      { title: "UOM", dataIndex: "uomId" },
                      { title: "Received Qty", dataIndex: "receivedQuantity" },
                      { title: "Accepted Qty", dataIndex: "acceptedQuantity" },
                      { title: "Rejected Qty", dataIndex: "rejectedQuantity" },
                      { title: "Rejection Type", dataIndex: "rejectionType"},
                      {title: "Reject Reason", dataIndex: "rejectReason"},
                    {
  title: "Warranty Terms",
  key: "warrantyTerms",
  render: (_, record) => {
    const value = warrantyMap[record.materialCode];
    if (!value) return "--";

    // Convert "1.00" → "1"
    return parseFloat(value).toString();
  }
},  {
                          title: "View Installation Report",
                          dataIndex: "installationReportFileName",
                          key: "viewReport",
                          render: (fileName) =>
                          fileName ? (
                          <a
                            href={`${baseURL}/file/view/INV/${fileName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        ) : (
                            "--"
                      ),
              },
                    ]
                  : [
                      { title: "Material Code", dataIndex: "materialCode" },
                      { title: "Description", dataIndex: "materialDesc" },
                      { title: "UOM", dataIndex: "uomId" },
                      { title: "Category", dataIndex: "category" },
                      { title: "Received Qty", dataIndex: "receivedQuantity" },
                      { title: "Unit Price", dataIndex: "unitPrice" },
                      { title: "Make No", dataIndex: "makeNo" },
                      { title: "Model No", dataIndex: "modelNo" },
                      { title: "Serial No", dataIndex: "serialNo" },
                    ]
              }
            />
          </div>
        </Spin>
      </Modal>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <HistoryOutlined /> Workflow History for {giDtls.inspectionNo}
          </div>
        }
        open={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        footer={null}
        width={800}
      >
        <Spin spinning={historyLoading}>
          <Table
            dataSource={history}
            columns={[
  {
    title: "Stage",
    dataIndex: "createdBy",
    key: "createdBy",
    render: (value) =>
      value === 29 ? (
        <Tag color="blue">Store Purchase Officer</Tag>
      ) : value === 18 ? (
        <Tag color="blue">Indent Creator</Tag>
      ) : (
        <Tag color="default">--</Tag>
      ),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (text) => (
      <Tag color={text === "APPROVED" ? "green" : "geekblue"}>
        {text?.toUpperCase()}
      </Tag>
    ),
  },
  {
    title: "Remarks",
    dataIndex: "remarks",
    key: "remarks",
    render: (text) => text || "--",
  },
  {
    title: "Date",
    dataIndex: "createDate",
    key: "createDate",
    render: (text) =>
      text
        ? new Date(text).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "--",
  },
]}

            rowKey="workflowTransitionId"
            pagination={false}
            scroll={{ x: true }}
            bordered
            size="small"
            locale={{
              emptyText: "No workflow history found",
            }}
          />
        </Spin>
      </Modal>
    </>
  );
};

export default InventoryQueueModal;
