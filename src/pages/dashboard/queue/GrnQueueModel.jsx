import React, { useState, useEffect } from "react";
import { Modal, Typography, Row, Col, Table, Button, Spin, Tag } from "antd";
import { HistoryOutlined, BarsOutlined } from "@ant-design/icons";
import axios from "axios";

const GrnQueueModal = ({
  modalVisible,
  setModalVisible,
  detailsData,
  loading,
}) => {
  const [historyVisible, setHistoryVisible] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const grnDtls = detailsData?.grnDtls || {};
  const giDtls = detailsData?.giDtls || {};
  const gprnDtls = detailsData?.gprnDtls || {};

  const fetchHistory = async () => {
    const grnNo = grnDtls?.grnNo;
    if (!grnNo) return;
    const [processId, subProcessId] = grnNo.split("/");
    setHistoryLoading(true);
    try {
      const response = await axios.get(`/api/process-controller/grnHistory`, {
        params: { processId, subProcessId },
      });
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

  const materialDtlList = (giDtls?.materialDtlList || []).map((giMaterial) => {
    const grnMaterial = grnDtls?.materialDtlList?.find(
      (m) => m.assetId === giMaterial.assetId
    ) || {};
    const gprnMaterial = gprnDtls?.materialDtlList?.find(
      (m) => m.materialCode === giMaterial.materialCode
    ) || {};

    return {
      assetId: grnMaterial.assetId || "",
    //  materialDesc: giMaterial.materialDesc || "",
      assetDesc: giMaterial.assetDesc || "",
      uomId: giMaterial.uomId || "",
      receivedQuantity: giMaterial.receivedQuantity || 0,
      locatorId: grnMaterial.locatorId || 0,
      depriciationRate: grnMaterial.depriciationRate || 0,
      bookValue: grnMaterial.bookValue || 0,
      acceptedQuantity: grnMaterial.quantity || 0,
      unitPrice: parseFloat(gprnMaterial?.unitPrice || 0),
    };
  });

  const grnColumns = [
    { title: "Asset Id", dataIndex: "assetId" },
   // { title: "Description", dataIndex: "materialDesc" },
    { title: "Asset Desc", dataIndex: "assetDesc" },
    { title: "UOM", dataIndex: "uomId" },
    { title: "Locator ID", dataIndex: "locatorId" },
    { title: "Received Qty", dataIndex: "receivedQuantity" },
    { title: "Accepted Qty", dataIndex: "acceptedQuantity" },
    { title: "Unit Price", dataIndex: "unitPrice" },
    { title: "Depreciation Rate", dataIndex: "depriciationRate" },
    { title: "Book Value", dataIndex: "bookValue" },
  ];

  return (
    <>
      <Modal
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>GRN No: {grnDtls?.grnNo || "Inventory Details"}</span>
            <Button type="link" icon={<HistoryOutlined />} onClick={() => setHistoryVisible(true)}>
              View History
            </Button>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1000}
        bodyStyle={{ padding: "24px" }}
      >
        <Spin spinning={loading}>
          <style>{`
            .detail-section { margin-bottom: 24px; padding: 16px; border: 1px solid #f0f0f0; border-radius: 8px; }
            .detail-item { margin-bottom: 12px; font-size: 14px; }
            .detail-item strong { display: inline-block; width: 200px; }
            .section-title { font-size: 16px; font-weight: 500; margin-bottom: 12px; }
          `}</style>

          <div className="detail-section">
            <Typography.Title level={5} className="section-title">GRN Details</Typography.Title>
            <Row gutter={24}>
              <Col span={12}><div className="detail-item"><strong>GRN No:</strong> {grnDtls.grnNo || "N/A"}</div></Col>
              <Col span={12}><div className="detail-item"><strong>GI No:</strong> {grnDtls.giNo || "N/A"}</div></Col>
              <Col span={12}><div className="detail-item"><strong>Installation Date:</strong> {grnDtls.installationDate || "N/A"}</div></Col>
              <Col span={12}><div className="detail-item"><strong>Commissioning Date:</strong> {grnDtls.commissioningDate || "N/A"}</div></Col>
              <Col span={12}><div className="detail-item"><strong>Location:</strong> {grnDtls.locationId || "N/A"}</div></Col>
              <Col span={12}><div className="detail-item"><strong>GRN Date:</strong> {grnDtls.grnDate || "N/A"}</div></Col>
              <Col span={12}><div className="detail-item"><strong>Indentor Name:</strong> {grnDtls.createdBy || "N/A"}</div></Col>
            </Row>
          </div>

          <div className="detail-section">
            <Typography.Title level={5} className="section-title">GI Details</Typography.Title>
            <Row gutter={24}>
              <Col span={12}><div className="detail-item"><strong>Inspection No:</strong> {giDtls.inspectionNo || "N/A"}</div></Col>
              <Col span={12}><div className="detail-item"><strong>Installation Date:</strong> {giDtls.installationDate || "N/A"}</div></Col>
              <Col span={12}><div className="detail-item"><strong>Commissioning Date:</strong> {giDtls.commissioningDate || "N/A"}</div></Col>
            </Row>
          </div>

          <div className="detail-section">
            <Typography.Title level={5} className="section-title">GPRN Details</Typography.Title>
            <Row gutter={24}>
              <Col span={12}><div className="detail-item"><strong>Process ID:</strong> {gprnDtls.processId || "N/A"}</div></Col>
              <Col span={12}><div className="detail-item"><strong>PO ID:</strong> {gprnDtls.poId || "N/A"}</div></Col>
              <Col span={12}><div className="detail-item"><strong>Date:</strong> {gprnDtls.date || "N/A"}</div></Col>
              <Col span={12}><div className="detail-item"><strong>Vendor Name:</strong> {gprnDtls.vendorName || "N/A"}</div></Col>
              <Col span={12}><div className="detail-item"><strong>Vendor Email:</strong> {gprnDtls.vendorEmail || "N/A"}</div></Col>
              <Col span={12}><div className="detail-item"><strong>Vendor Contact:</strong> {gprnDtls.vendorContact || "N/A"}</div></Col>
            </Row>
          </div>

          <div className="detail-section">
            <Typography.Title level={5} className="section-title">
              <BarsOutlined /> Material Details
            </Typography.Title>
            <Table
              dataSource={materialDtlList}
              columns={grnColumns}
              pagination={false}
              bordered
              scroll={{ x: 1200 }}
              rowKey="assetId"
            />
          </div>
        </Spin>
      </Modal>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <HistoryOutlined /> Workflow History for {grnDtls?.grnNo}
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
                  ) : value === 43 ? (
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
            locale={{ emptyText: "No workflow history found" }}
          />
        </Spin>
      </Modal>
    </>
  );
};

export default GrnQueueModal;
