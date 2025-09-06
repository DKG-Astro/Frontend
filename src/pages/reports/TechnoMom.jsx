import React, {useEffect,useState} from 'react'
import CustomReport from '../../components/DKG_Report';

const TechnoMom =  ({ onChartData, selectedBarKey, selectedPieKey }) => {
  const [reportData, setReportData] = useState([]);
  const api = "/api/reports/techNoMom/report"
  const handleFetch = (startDate, endDate, data) => {
    const finalData = data || [];
    setReportData(finalData);
    generateChart(finalData);
  };

  const generateChart = (finalData) => {
    const barDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedBarKey] || "value";
      acc[key] = (acc[key] || 0) + (item.value || 0);
      return acc;
    }, {});

    const pieDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedPieKey] || "value";
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
      title: "Date",
      dataIndex: "date",
      key: "date",
      filterable: true
    },
    {
      title: "Uploaded Techno-Commercial MoM Reports",
      dataIndex: "uploadedTechnoCommercialMoMReports",
      key: "uploadedTechnoCommercialMoMReports",
      filterable: true
    },
    {
      title: "PO/WO Number",
      dataIndex: "poWoNumber",
      key: "poWoNumber",
      filterable: true
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      filterable: true
    },
    {
      title: "Corresponding Indent Number",
      dataIndex: "correspondingIndentNumber",
      key: "correspondingIndentNumber",
      filterable: true
    },
  ];
  return <CustomReport api={api} columns={columns} title="Techno Mom Report" filterType="date" storageKey="TECHNO_REPORT_COLUMNS" onFetch={handleFetch}/>
}

export default TechnoMom
