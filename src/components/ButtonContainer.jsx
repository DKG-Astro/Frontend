import { Button, message, Tooltip } from "antd";
import React from "react";
import {
  UndoOutlined,
  SaveOutlined,
  CloudDownloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const ButtonContainer = ({
  submitBtnLoading,
  submitBtnEnabled,
  onFinish,
  printBtnEnabled,
  handlePrint,
  draftDataName,
  draftBtnEnabled,
  formData,
  disabled
}) => {
  const navigate = useNavigate();
  const location = useLocation()
  const saveDraft = () => {
    localStorage.setItem(draftDataName, JSON.stringify(formData))
    message.success("The form has been saved as a draft successfully.")
  }

  const handleReset = () => {
    localStorage.removeItem(draftDataName);
    navigate(location.pathname,
      {
        state: {data: null, itemList: null}
      }
    )
    window.location.reload();

    message.success("The form has been reset, and any saved drafts have been cleared.")
  }

  return (
    <div className="grid md:grid-cols-4 gap-2">
      <Tooltip title="Clear form">
        <Button
          // type="primary"
          danger
          icon={<UndoOutlined />}
          onClick={handleReset}
        >
          Reset
        </Button>
      </Tooltip>

      <Tooltip
        title={
          submitBtnEnabled
            ? "Submit form"
            : "Press reset button to enable submit."
        }
      >
        <Button
          onClick={onFinish}
          type="primary"
          style={{
            backgroundColor: "#4CAF50",
          }}
          icon={<SaveOutlined />}
          disabled={disabled ? true : (submitBtnEnabled ? false : true)}
          loading={submitBtnLoading}
        >
          Submit
        </Button>
      </Tooltip>

      <Tooltip title={"Save the form as draft."}>
        <Button
          onClick={saveDraft}
          type="warning"
          className="border-yellow-300"
          icon={<CloudDownloadOutlined />}
          disabled={disabled ? true : (draftBtnEnabled ? false : true)}
        >
          Save draft
        </Button>
      </Tooltip>

      <Tooltip
        title={
          printBtnEnabled ? "Print form" : "Submit the form to enable print."
        }
      >
        <Button
          onClick={handlePrint}
          // type="primary"
          icon={<PrinterOutlined />}
          disabled={printBtnEnabled ? false : true}
          className="border-blue-300"
        >
          Print
        </Button>
      </Tooltip>
    </div>
  );
};

export default ButtonContainer;
