/*import React, { forwardRef } from "react";
import logo from "../assets/images/iia-logo.png";

const GprnPrintFormat = forwardRef(({ formData }, ref) => {
  if (!formData || !formData.gprnNo) return null;

  const getTotalPrice = (item) =>
    (item.unitPrice || 0) * (item.receivedQty || 0);

  const borderedRow = (label1, val1, label2, val2) => (
    <tr>
      <td className="border p-1 font-semibold w-[25%]">{label1}</td>
      <td className="border p-1 w-[25%]">{val1 || ""}</td>
      <td className="border p-1 font-semibold w-[25%]">{label2}</td>
      <td className="border p-1 w-[25%]">{val2 || ""}</td>
    </tr>
  );

  return (
    <div ref={ref} className="p-4 text-sm text-black font-sans">
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          .print-wrapper {
            background: white;
            width: 100%;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          td, th {
            border: 1px solid black;
            padding: 4px;
          }
        }
      `}</style>

      <div className="print-wrapper">
        
        <div className="flex items-center justify-between mb-4">
          <img src={logo} alt="IIA Logo" className="w-20 h-20" />
          <div className="text-center flex-1 -ml-20">
            <h2 className="font-bold text-base uppercase">INDIAN INSTITUTE OF ASTROPHYSICS</h2>
            <p className="font-bold text-base uppercase">2nd Block, Koramangala, Bengaluru – 560034</p>
          </div>
        </div>

        <h4 className="text-center font-bold border border-black py-1 mb-2">
          GOODS PROVISIONAL RECEIPT NOTE
        </h4>

        <table className="mb-2">
          <tbody>
            {borderedRow("PURCHASE ORDER (PO)", formData.poId, "GPRN NUMBER", formData.gprnNo)}
            {borderedRow("PO DATE", formData.deliveryDate, "GPRN DATE", formData.date)}
            {borderedRow("CONSIGNEE LOCATION", formData.consigneeLocation || null)}
          </tbody>
        </table>


        <table className="mb-2">
          <tbody>
            {borderedRow("INDENTOR NAME", formData.indentorName, "MODE OF PROCUREMENT", formData.procurementMode)}
            {borderedRow("INDENTOR CONTACT NO", formData.indentorContact, "VENDOR NAME", formData.vendorName)}
            {borderedRow("INDENTOR EMAIL ID", formData.indentorEmail, "VENDOR CONTACT NO", formData.vendorContact)}
            {borderedRow("PROJECT", formData.project, "VENDOR EMAIL ID", formData.vendorEmail)}
          </tbody>
        </table>

    
        <h4 className="text-center font-semibold border border-black py-1 mb-2">MATERIAL DETAILS</h4>
        <table className="text-xs mb-2">
          <thead>
            <tr>
              {[
                "S. NO.", "DESCRIPTION OF ITEM", "QUANTITY RECEIVED", "QUANTITY PENDING",
                "SERIAL NO. (IF APPLICABLE)", "UNIT PRICE", "TOTAL PRICE (FOR QTY RECEIVED)"
              ].map((head, idx) => (
                <th key={idx} className="border text-left">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {formData.materialDtlList?.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.materialDescription}</td>
                <td>{item.receivedQuantity}</td>
                <td>{item.orderedQuantity}</td>
                <td>{item.serialNo}</td>
                <td>{item.unitPrice}</td>
                <td>{(item.unitPrice * item.receivedQuantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

      
        <div className="mb-2">
          <strong>REMARKS:</strong> {formData.remarks}
        </div>

        <div className="text-xs border-t border-black pt-2">
          <strong>NOTE:</strong> IF INSPECTION IS NOT COMPLETED WITHIN 5 WORKING DAYS, IT IS DEEMED TO HAVE BEEN ACCEPTED FROM THE INDENTOR
        </div>
      </div>
    </div>
  );
});

export default GprnPrintFormat;
*/
import React, { forwardRef } from "react";
import logo from "../assets/images/iia-logo.png";

const GprnPrintFormat = forwardRef(({ formData }, ref) => {
  if (!formData || !formData.gprnNo) return null;

  const getTotalPrice = (item) =>
    (item.unitPrice || 0) * (item.receivedQuantity || 0);

  const borderedRow = (label1, val1, label2, val2) => (
    <tr>
      <td className="td">{label1}</td>
      <td className="td">{val1 || ""}</td>
      <td className="td">{label2 || ""}</td>
      <td className="td">{val2 || ""}</td>
    </tr>
  );

  return (
    <div ref={ref} className="text-sm text-black font-sans">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            margin: 0;
            padding: 0;
          }
        }
        .wrapper {
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
        }
        .td, .th {
          border: 1px solid black;
          padding: 6px;
          text-align: left;
          vertical-align: top;
        }
        .table {
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 12px;
        }
        .center {
          text-align: center;
        }
        .bold {
          font-weight: bold;
        }
      `}</style>

      <div className="wrapper">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <img src={logo} alt="IIA Logo" style={{ width: 80, height: 80 }} />
          <div style={{ flex: 1, textAlign: "center", marginLeft: -80 }}>
            <h2 className="bold">INDIAN INSTITUTE OF ASTROPHYSICS</h2>
            <h3 className="bold">2nd Block, Koramangala, Bengaluru – 560034</h3>
          </div>
        </div>

        <div className="bold center" style={{ border: "1px solid black", padding: "4px", marginBottom: 8 }}>
          GOODS PROVISIONAL RECEIPT NOTE
        </div>

        {/* PO & GPRN Details */}
        <table className="table">
          <tbody>
            {borderedRow("PURCHASE ORDER (PO)", formData.poId, "GPRN NUMBER", formData.gprnNo)}
            {borderedRow("PO DATE", formData.deliveryDate, "GPRN DATE", formData.date)}
            {borderedRow("CONSIGNEE LOCATION", formData.consigneeDetail)}
          </tbody>
        </table>

        {/* Indentor & Vendor Details */}
        <table className="table">
          <tbody>
            {borderedRow("INDENTOR NAME", formData.indentorName, "MODE OF PROCUREMENT", formData.procurementMode)}
            {borderedRow("INDENTOR CONTACT NO", formData.indentorContact, "VENDOR NAME", formData.vendorName)}
            {borderedRow("INDENTOR EMAIL ID", formData.indentorEmail, "VENDOR CONTACT NO", formData.vendorContactNo)}
            {borderedRow("PROJECT", formData.project, "VENDOR EMAIL ID", formData.vendorEmail)}
          </tbody>
        </table>

        {/* Material Details */}
        <div className="bold center" style={{ border: "1px solid black", padding: "4px", marginBottom: 8 }}>
          MATERIAL DETAILS
        </div>
        <table className="table text-xs">
          <thead>
            <tr>
              {[
                "S. NO.",
                "DESCRIPTION OF ITEM",
                "QUANTITY RECEIVED",
                "QUANTITY PENDING",
                "SERIAL NO.(IF APPLICABLE)",
                "UNIT PRICE",
                "TOTAL PRICE(FOR QTY RECEIVED)"
              ].map((head, idx) => (
                <th key={idx} className="th">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {formData.materialDtlList?.map((item, idx) => (
              <tr key={idx}>
                <td className="td">{idx + 1}</td>
                <td className="td">{item.materialDesc}</td>
                <td className="td">{item.receivedQuantity}</td>
                <td className="td">
                  {(item.orderedQuantity || 0) - (item.receivedQuantity || 0)}
                </td>
                <td className="td">{item.serialNo}</td>
                <td className="td">{item.unitPrice}</td>
                <td className="td">{getTotalPrice(item).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Remarks */}
        <div style={{ marginBottom: 8 }}>
          <strong>REMARKS:</strong> {formData.remarks}
        </div>

        {/* Note */}
        <div className="text-xs" style={{ borderTop: "1px solid black", paddingTop: 6 }}>
          <strong>NOTE:</strong> IF INSPECTION IS NOT COMPLETED WITHIN 5 WORKING DAYS, IT IS DEEMED TO HAVE BEEN ACCEPTED FROM THE INDENTOR
        </div>
      </div>
    </div>
  );
});

export default GprnPrintFormat;
