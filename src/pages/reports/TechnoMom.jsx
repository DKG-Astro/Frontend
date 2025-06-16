import React from 'react'
import CustomReport from '../../components/DKG_Report';

const TechnoMom = () => {
  const api = "/api/reports/techNoMom/report"
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
  return <CustomReport api={api} columns={columns} title="Techno Mom Report" filterType="date"/>
}

export default TechnoMom
