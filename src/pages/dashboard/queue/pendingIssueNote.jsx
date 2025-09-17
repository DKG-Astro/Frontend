import React, { useEffect, useState } from "react";
import { message, Table, Button, Space } from "antd";
import axios from "axios";
import TableComponent from "../../../components/DKG_Table";
import { useNavigate } from "react-router-dom";

const PendingIssueNote = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch Pending Issue Note Data
  const fetchPendingIssueNote = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/process-controller/getPendingIssueNote");

      const rows = (data?.responseData || []).map((item) => ({
        ...item,
        status: item.status || "DEMAND",
        details: item.materialDtlList || [],
      }));

      setDataSource(rows);
    } catch (error) {
      console.error(error);
      message.error(
        error?.response?.data?.responseStatus?.message ||
          "Error fetching pending issue notes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingIssueNote();
  }, []);

  // Table Columns (Same as DemandAndIssueQueue)
  const columns = [
    { title: "DI ID", dataIndex: "id", key: "id", searchable: true, fixed: "left" },
    { title: "Location", dataIndex: "senderLocationId", key: "senderLocationId", searchable: true },
    { title: "User Id", dataIndex: "senderCustodianId", key: "senderCustodianId", searchable: true },
    { title: "User Name", dataIndex: "senderCustodianName", key: "senderCustodianName", searchable: true },
    { title: "DI Date", dataIndex: "diDate", key: "diDate", searchable: true },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Material Details",
      dataIndex: "details",
      key: "details",
      render: (details = []) => (
        <Table
          dataSource={details}
          pagination={false}
          rowKey={(r, idx) => r.materialCode || `${r.assetId || "row"}-${idx}`}
          columns={[
            { title: "Material Code", dataIndex: "materialCode", key: "materialCode" },
            { title: "Material Description", dataIndex: "materialDesc", key: "materialDesc" },
           { title: "Quantity", dataIndex: "quantity", key: "quantity" },
            { title: "Locator", dataIndex: "senderLocatorId", key: "senderLocatorId" },
           ]}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate("/inventory/demandIssue", { state: { diId: record.id } })}
          >
            Issue Note
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <TableComponent
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        storageKey="PendingIssueNote_REPORT_COLUMNS"
      />
    </div>
  );
};

export default PendingIssueNote;
