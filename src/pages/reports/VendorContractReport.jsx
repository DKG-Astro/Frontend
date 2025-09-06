import React ,{useEffect,useState} from 'react'
import CustomReport from '../../components/DKG_Report';

const VendorContract = ({ onChartData, selectedBarKey, selectedPieKey }) => {
  const [reportData, setReportData] = useState([]);
  const api = "/api/reports/vendor-contracts/report"
  const handleFetch = (startDate, endDate, data) => {
    const finalData = data || [];
    setReportData(finalData);
    generateChart(finalData);
  };

  const generateChart = (finalData) => {
    const barDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedBarKey] || "Unknown";
      acc[key] = (acc[key] || 0) + (item.value || 0);
      return acc;
    }, {});

    const pieDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedPieKey] || "No Data";
      acc[key] = (acc[key] || 0) + (item.value || 0);
      return acc;
    }, {});

    const barData = Object.keys(barDataMap).map(k => ({ name: k, value: barDataMap[k] }));
    const pieData = Object.keys(pieDataMap).map(k => ({ name: k, value: pieDataMap[k] }));

    if (onChartData) onChartData(barData, pieData);
  };

  useEffect(() => {
    if (reportData.length > 0) {
      generateChart(reportData);
    }
  }, [selectedBarKey, selectedPieKey]);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      filterable: true
    },
    {
      title: "Mode of Procurement",
      dataIndex: "modeOfProcurement",
      key: "modeOfProcurement",
      filterable: true
    },
    {
      title: "Under AMC",
      dataIndex: "underAmc",
      key: "underAmc",
      filterable: true
    },
    {
      title: "AMC Expiry Date",
      dataIndex: "amcExpiryDate",
      key: "amcExpiryDate",
      filterable: true
    },
    {
      title: "AMC For",
      dataIndex: "amcFor",
      key: "amcFor",
      filterable: true
    },
    {
      title: "End User",
      dataIndex: "endUser",
      key: "endUser",
      filterable: true
    },
    {
      title: "No. of Participants",
      dataIndex: "noOfParticipants",
      key: "noOfParticipants",
      filterable: true
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      filterable: true
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      filterable: true
    },
    {
      title: "Vendor Name",
      dataIndex: "vendorName",
      key: "vendorName",
      filterable: true
    },
    {
      title: "Previously Renewed AMCs",
      dataIndex: "previouslyRenewedAmcs",
      key: "previouslyRenewedAmcs",
      filterable: true
    },
    {
      title: "Category of Security",
      dataIndex: "categoryOfSecurity",
      key: "categoryOfSecurity",
      filterable: true
    },
    {
      title: "Validity of Security",
      dataIndex: "validityOfSecurity",
      key: "validityOfSecurity",
      filterable: true
    },
  ];
  return <CustomReport api={api} columns={columns} title="Vendor Contract Report" filterType="date" storageKey="VENDORCONTRACT_REPORT_COLUMNS" onFetch={handleFetch}/>
}

export default VendorContract
