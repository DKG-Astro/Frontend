import { Card } from "antd";
import React, { useRef, useState } from "react";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import { renderFormFields } from "../../../utils/CommonFunctions";
import { generalDtls } from "./InputFields";
import ButtonContainer from "../../../components/ButtonContainer";
import { useReactToPrint } from "react-to-print";

const GoodsInspection = () => {
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const [formData, setFormData] = useState({
    // gprnNo: "GPRN-2025001",
    // poId: "PO-123456",
    // // date: "13/12/2001",
    // deliveryChallanNo: "DCN-78901",
    // // deliveryChallanDate: "13/12/2001",
    // vendorId: "VEND-001",
    // vendorName: "Astro Supplies Ltd.",
    // vendorEmail: "vendor@example.com",
    // vendorContactNo: 9876543210,
    // fieldStation: "Station A",
    // indentorName: "John Doe",
    // // expectedSupplyDate: "13/12/2001",
    // consigneeDetail: "XYZ Warehouse, New York",
    // warrantyYears: 2,
    // project: "Space Exploration Project",
    // receivedQty: "100",
    // pendingQty: "20",
    // acceptedQty: "80",
    // provisionalReceiptCertificate: null,
    // receivedBy: "Jane Doe",
    // createdBy: "Admin",
    // updatedBy: "Editor",
    // // createdDate: "13/12/2001",
    // // updatedDate: "13/12/2001",
    // gprnMaterials: [
    //   {
    //     materialCode: "MAT-001",
    //     description: "Aluminum Sheet",
    //     uom: "KG",
    //     orderedQuantity: 200,
    //     quantityDelivered: 180,
    //     receivedQuantity: 170,
    //     unitPrice: 25.5,
    //     makeNo: "Make-123",
    //     modelNo: "Model-XYZ",
    //     serialNo: "SN-001A",
    //     warranty: "2 Years",
    //     note: "Handle with care",
    //     photographPath: "images/aluminum_sheet.jpg",
    //   },
    // ],
  });
  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const onFinish = async () => {};
  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Goods Inspection" />
      <CustomForm formData={formData} >
        {renderFormFields(generalDtls, handleChange, formData)}
        <ButtonContainer
          onFinish={onFinish}
          formData={formData}
          draftDataName="goodsInspectionDraft"
          submitBtnEnabled
          printBtnEnabled
          draftBtnEnabled
          handlePrint={handlePrint}
        />
      </CustomForm>
    </Card>
  );
};

export default GoodsInspection;
