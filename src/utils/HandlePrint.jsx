import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const handlePrint = (form) => {
  const values = form.getFieldsValue(true);
  const printContent = generatePrintableContent(values);
  const printWindow = window.open("", "_blank");
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Indent Form - ${values.indentId || "Draft"}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .print-header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 25px; break-inside: avoid; }
          .section h2 { color: #333; border-bottom: 2px solid #666; padding-bottom: 5px; }
          .field-row { margin: 12px 0; display: flex; }
          .field-label { font-weight: bold; min-width: 200px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #f5f5f5; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align: center; margin-bottom: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Print Now
          </button>
        </div>
        ${printContent}
      </body>
    </html>
  `);
  
  printWindow.document.close();
};

const generatePrintableContent = (values) => {
  const formatDate = (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "N/A");
  
  const hasPacMaterial = (lineItems) => {
    return lineItems?.some((item) => item?.modeOfProcurement === "Brand PAC");
  };

  return `
    <div class="print-header">
      <h1 style="text-transform: uppercase;">INDIAN INSTITUTE OF ASTROPHYSICS</h1>
      <h3>Indent${values.indentId ? ` - ${values.indentId}` : ''}</h3>
      ${values.indentId ? `<p><strong>Indent ID:</strong> ${values.indentId}</p>` : ""}
    </div>

    <div class="section">
      <h2>Basic Information</h2>
      <div class="field-row">
        <span class="field-label">Indentor Name:</span> ${values.indentorName || "N/A"}
      </div>
      <div class="field-row">
        <span class="field-label">Indentor Mobile:</span> ${values.indentorMobileNo || "N/A"}
      </div>
      <div class="field-row">
        <span class="field-label">Consignee Location:</span> ${values.consigneeLocation || "N/A"}
      </div>
    </div>

    <div class="section">
      <h2>Line Items</h2>
      <table>
        <thead>
          <tr>
            <th>Material Code</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total Price</th>
            <th>UOM</th>
          </tr>
        </thead>
        <tbody>
          ${(values.lineItems || [])
            .map(
              (item) => `
            <tr>
              <td>${item.materialCode || "N/A"}</td>
              <td>${item.materialDescription || "N/A"}</td>
              <td>${item.quantity || "0"}</td>
              <td>${item.unitPrice || "0.00"}</td>
              <td>${item.totalPrice || "0.00"}</td>
              <td>${item.uom || "N/A"}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Project Details</h2>
      <div class="field-row">
        <span class="field-label">Project Name:</span> ${values.projectName || "N/A"}
      </div>
      <div class="field-row">
        <span class="field-label">Pre-bid Meeting:</span> 
        ${values.preBidMeetingRequired ? "Required" : "Not Required"}
      </div>
      ${
        values.preBidMeetingRequired
          ? `
        <div class="field-row">
          <span class="field-label">Meeting Date:</span> ${formatDate(values.preBidMeetingDetails)}
        </div>
        <div class="field-row">
          <span class="field-label">Meeting Location:</span> ${values.preBidMeetingLocation || "N/A"}
        </div>
      `
          : ""
      }
    </div>

    <div class="section">
      <h2>Attachments</h2>
      <div class="field-row">
        <span class="field-label">Technical Specifications:</span> 
        ${values.technicalSpecificationsFileName?.[0]?.name || "Not attached"}
      </div>
      <div class="field-row">
        <span class="field-label">Draft EOI/RFP:</span> 
        ${values.draftEOIOrRFPFileName?.[0]?.name || "Not attached"}
      </div>
      ${
        hasPacMaterial(values.lineItems)
          ? `
        <div class="field-row">
          <span class="field-label">Brand PAC:</span> 
          ${values.uploadPACOrBrandPACFileName?.[0]?.name || "Not attached"}
        </div>
      `
          : ""
      }
    </div>
  `;
};