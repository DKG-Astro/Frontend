import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Spin, Tag, Table, Checkbox, Popover, Input, Button } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Heading from '../../../components/DKG_Heading';
import FormContainer from '../../../components/DKG_FormContainer';
import FormBody from '../../../components/DKG_FormBody';
import CustomForm from "../../../components/DKG_CustomForm";
import { renderFormFields } from "../../../utils/CommonFunctions";
import Btn from '../../../components/DKG_Btn';
import { baseURL } from '../../../App';
import TenderEvaluationHistory from '../queue/TenderEvaluationHistory';

const TenderEvaluator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenderId: initialTenderId } = location.state || {};
  const { userId } = useSelector(state => state.auth);
 

  const [formData, setFormData] = useState({
    tenderId: initialTenderId || '',
    bidType: '',
    totalValue: null, 
    comparationStatementFileName: [],
  });
  const [quotationData, setQuotationData] = useState([]);
  const [notSubmittedVendors, setNotSubmittedVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [rejectedVendorId, setRejectedVendorId] = useState(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [selectedVendorForHistory, setSelectedVendorForHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loadingTender, setLoadingTender] = useState(false);
  const [loadingQuotations, setLoadingQuotations] = useState(false);
  const [hasComparisonSheet, setHasComparisonSheet] = useState(false);


  const tenderId = formData.tenderId;
  const bidType = formData.bidType;
  const role = useSelector(state => state.auth.role); 
  const isBelow10L = formData.totalValue <= 1000000;
  const hasMultipleIndents = formData.indentNumber > 1;
  const canTakeAction = role === 'Purchase personnel' || (role === 'Indent Creator' && isBelow10L && !hasMultipleIndents);

// SPO can act only if comparison sheet is already submitted
const canSpoAct = role === 'Store Purchase Officer' && hasComparisonSheet;

// show evaluation section only if indentor/Purchase Personal can act OR SPO with comparison sheet
const showEvaluationSection = (role === 'Purchase personnel' || (role === 'Indent Creator' && isBelow10L && !hasMultipleIndents)) || canSpoAct;

  const fetchQuotationsAndPending = async (tid) => {
  setLoadingQuotations(true);
  try {
    const [qRes, nsvRes] = await Promise.all([
      axios.get(`/api/vendor-quotation/${tid}`, {
        params: { userRole: role } 
      }),
      axios.get(`/api/vendor-quotation/NotSubmitVendors/${tid}`)
    ]);
    setQuotationData(qRes.data?.responseData || []);
    setNotSubmittedVendors(nsvRes.data?.responseData || []);
  } catch (err) {
    message.error('Failed to fetch quotation-related data');
  } finally {
    setLoadingQuotations(false);
  }
};

const handleSearchTender = async () => {
  if (!tenderId || !tenderId.trim()) {
    return message.warning('Please enter Tender ID to search');
  }
  try {
    setLoadingTender(true);

     const baseQuotationResp = await axios.get(`${baseURL}/api/vendor-quotation/${tenderId}`, {
      params: { userRole: role } // send role if backend expects it
    });
    const baseQuotationList = baseQuotationResp.data?.responseData || [];
    setQuotationData(baseQuotationList);

    // flow for Store Purchase Officer: require comparison sheet
    if (role === 'Store Purchase Officer') {
      const compResp = await axios.get(`${baseURL}/api/vendor-quotation/getAllVendorQuotations/${tenderId}`);
      const { vendor = [], uploadQualifiedVendorsFileName } = compResp.data?.responseData || {};

      if (!uploadQualifiedVendorsFileName) {
        // Block SPO until comparison statement exists
        setHasComparisonSheet(false);
        setQuotationData([]); // hide stale
        message.warning("Comparison Statement not submitted yet by Indentor / Purchase personnel.");
        return;
      }

      // Comparison sheet exists: enable SPO actions
      setHasComparisonSheet(true);
     // setQuotationData(vendor); // override with richer data (status/remarks)
      setFormData(prev => ({
        ...prev,
        comparationStatementFileName: [uploadQualifiedVendorsFileName],
      }));
      const approvedRes = await axios.get('/getApprovedTenderId', {
        params: { tenderId: tenderId.trim() }
      });
      const approved = approvedRes.data?.responseData || approvedRes.data;
      if (approved) {
        setFormData(prev => ({
          ...prev,
          tenderId: approved.tenderId || prev.tenderId,
          bidType: approved.bidType || prev.bidType,
          totalValue: approved.totalValue || prev.totalValue,
          indentNumber: approved.indentNumber || prev.indentNumber,
        }));
      }
      return; 
    }

    // 3. Non-SPO path: Purchase Personal / Indentor
    const approvedRes = await axios.get('/getApprovedTenderId', {
      params: { tenderId: tenderId.trim()}
    });
    const approved = approvedRes.data?.responseData || approvedRes.data;
     
    if (!approved) {
      message.warning('No approved tender found for given ID');
      return;
    }

    const updatedFormData = {
      tenderId: approved.tenderId || tenderId.trim(),
      bidType: approved.bidType || '',
      totalValue: approved.totalValue || null,
      indentNumber: approved.indentNumber || 0
    };
    setFormData(updatedFormData);

    const isBelow10LLocal = updatedFormData.totalValue <= 1000000;
    const hasMultipleIndentsLocal = updatedFormData.indentNumber > 1;

    const isAuthorized =
      role === 'Purchase personnel' ||
      (role === 'Indent Creator' && isBelow10LLocal && !hasMultipleIndentsLocal);

    if (!isAuthorized) {
      setQuotationData([]);
      setNotSubmittedVendors([]);
      message.warning("You don't have permission to evaluate this tender based on your role and tender details.");
      return;
    }

    // finally fetch the normal quotation + pending vendors list
    await fetchQuotationsAndPending(updatedFormData.tenderId);
  } catch (err) {
    message.error('Failed to fetch approved tender');
  } finally {
    setLoadingTender(false);
  }
};

  const fetchVendorHistory = async (vendorId) => {
    try {
      setHistoryLoading(true);
      const res = await axios.get(`/api/vendor-quotation/vendorHistory/${tenderId}/${vendorId}`);
      setHistoryData(res.data?.responseData || []);
    } catch (error) {
      message.error("Failed to fetch quotation history");
      setHistoryData([]);
    } finally {
      setHistoryLoading(false);
    }
  };
/*
 const handleChange = (key, value) => {
  if (key === "comparationStatementFileName" && Array.isArray(value) && value.length > 0) {
    const fileName = value[0]?.name || ""; // Only extract file name
    setFormData(prev => ({
      ...prev,
      [key]: [fileName] // Still store as array (since your code expects an array)
    }));
  } else {
    setFormData(prev => ({ ...prev, [key]: value }));
  }
};*/
const handleChange = (key, value) => {
  setFormData(prev => ({ ...prev, [key]: value }));
};


  const handleSubmit = async () => {
  if (!formData.comparationStatementFileName || formData.comparationStatementFileName.length === 0) {
    return message.warning("Please upload the Comparison Statement file.");
  }

  const payload = {
    tenderId: tenderId,
    uploadQualifiedVendorsFileName: formData.comparationStatementFileName[0], 
    createdBy: userId, 
    fileType: "Tender",
  };

  try {
    setIsSubmitting(true);
    await axios.post(`/api/tender-evaluation`, payload);
    message.success("Tender evaluation submitted successfully");
  } catch (error) {
    console.error(error);
    message.error("Failed to submit tender evaluation");
  } finally {
    setIsSubmitting(false);
  }
};


  const handleReject = async (record) => {
  if (!rejectComment.trim()) {
    return message.warning("Please enter a rejection comment.");
  }
  try {
    await axios.put(`/api/vendor-quotation/reject`, {
        tenderId,
        vendorId: record.vendorId,
        remarks: rejectComment,
        userId:userId,
      });
    
    message.success(`Vendor ${record.vendorId} rejected`);
    setRejectComment('');
    setRejectedVendorId(null);
    await fetchQuotationsAndPending(tenderId);
  } catch (err) {
    message.error("Failed to reject vendor");
  }
};


  const handleChangeRequest = async (record) => {
    if (!rejectComment.trim()) {
      return message.warning("Please enter a change request comment.");
    }
    try {
      await axios.post("/api/vendor-quotation/change-request", {
        tenderId,
        vendorId: record.vendorId,
        remarks: rejectComment,
        userId:userId,
      });
      message.success(`Change request sent to vendor ${record.vendorId}`);
      setRejectComment('');
      setRejectedVendorId(null);
      await fetchQuotationsAndPending(tenderId);
    } catch (err) {
      message.error("Failed to send change request");
    }
  };

  const handleAccept = async (record) => {
    try {
      await axios.put(`/api/vendor-quotation/quotations/accept`, null, {
        params: { tenderId, vendorId: record.vendorId, userId }
      });
      message.success(`Vendor ${record.vendorId} accepted`);
      await fetchQuotationsAndPending(tenderId);
    } catch (err) {
      message.error("Failed to accept vendor quotation");
    }
  };

 const handleSpoReview = async (record, actionType) => {
  if (actionType === 'CHANGE_REQUEST_TO_INTENTOR' && !rejectComment.trim()) {
    return message.warning("Please enter a change request comment.");
  }

  try {
    const spoDto = {
      tenderId: tenderId,
      vendorId: record.vendorId,
      action: actionType,
      remarks: actionType === 'CHANGE_REQUEST_TO_INTENTOR' ? rejectComment : '',
      userId:userId
    };

    await axios.post(`/api/vendor-quotation/spo-review`, spoDto);
    message.success(`SPO action '${actionType}' performed for vendor ${record.vendorId}`);
    setRejectComment('');
    setRejectedVendorId(null);
    await fetchQuotationsAndPending(tenderId);
  } catch (err) {
    message.error("Failed to perform SPO review action");
  }
};
const isDouble = (formData.bidType || '').toLowerCase() === 'double';

const priceBidColumn = {
  title: 'Price Bid',
  dataIndex: 'priceBidFileName',
  key: 'priceBidFileName',
  render: (fileName, record) => {
    if (record.status !== 'Completed') return null; 
    if (!fileName) return 'No File';
    return (
      <a
        href={`${baseURL}/file/view/Tender/${fileName}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View
      </a>
    );
  },
};


const baseColumns = [
  {
    title: 'Vendor ID',
    dataIndex: 'vendorId',
    key: 'vendorId',
    render: (vid) => (
  <a
    style={{ color: '#1890ff' }}
    onClick={() => {
      setSelectedVendorForHistory(vid);
      setHistoryVisible(true);
    }}
  >
    {vid}
  </a>
)

  },
  {
    title: 'Quotation File Name',
    dataIndex: 'quotationFileName',
    key: 'quotationFileName',
  },
  {
    title: 'View File',
    key: 'view',
    render: (_, record) => (
      record.quotationFileName ? (
        <a
          href={`${baseURL}/file/view/Tender/${record.quotationFileName}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </a>
      ) : 'No File'
    )
  },
  ...(isDouble ? [priceBidColumn] : []),

 


];

let columns = [];

if (role === 'Store Purchase Officer') {
  columns = [
    ...baseColumns,
   {
          title: `${role} Status`,
          key: 'status',
          dataIndex: 'status',
          render: (status) => status || 'N/A',
        },
      /*   ...(formData.bidType === 'Double'
    ? [
        {
          title: 'Price Bid',
          dataIndex: 'priceBidFileName',
          key: 'priceBidFileName',
          render: (fileName, record) => {
            if (record.status !== 'Completed') return null; // only show when Completed
            if (!fileName) return 'No File';
            return (
             <a
          href={`${baseURL}/file/view/Tender/${record.priceBidFileName}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </a>
            );
          },
        },
      ]
    : [])*/,
         {
          title: `Indentor Status`,
          key: 'indentorStatus',
          dataIndex: 'indentorStatus',
          render: (indentorStatus) => indentorStatus || 'N/A',
        },
     /*   {
          title: 'Remarks',
          key: 'remarks',
          dataIndex: 'remarks',
          render: (remarks) => remarks || 'N/A',
        },*/
    /*{
      title: `${role} Status`,
      key: 'spoStatus',
      dataIndex: 'spoStatus',
      render: (spoStatus) => spoStatus || 'N/A',
    },*/
  /*  {
      title: 'SPO Remarks',
      key: 'spoRemarks',
      dataIndex: 'spoRemarks',
      render: (r) => r || '-',
    }*/,
   {
  title: 'SPO Actions',
  key: 'spoActions',
  render: (_, record) => {
    const spoCanAct = record.canSpoAct && hasComparisonSheet; // use backend flag + comparison sheet presence
    const pendingToIndentor = record.changeRequestToIndentor;

    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button
          size="small"
          disabled={!spoCanAct}
          onClick={() => handleSpoReview(record, 'ACCEPT')}
        >
          {record.spoStatus === 'ACCEPTED' ? 'Accepted' : 'SPO Accept'}
        </Button>
        <Button
          size="small"
          disabled={!spoCanAct}
          onClick={() => handleSpoReview(record, 'REJECT')}
        >
          {record.spoStatus === 'REJECTED' ? 'Rejected' : 'SPO Reject'}
        </Button>
        <Popover
          content={
            <div style={{ padding: 12 }}>
              <Input.TextArea
                placeholder="Enter change request to Indentor"
                rows={3}
                value={rejectedVendorId === record.vendorId ? rejectComment : ''}
                onChange={(e) => {
                  setRejectedVendorId(record.vendorId);
                  setRejectComment(e.target.value);
                }}
              />
              <Button
                type="primary"
                disabled={!spoCanAct}
                onClick={() => handleSpoReview(record, 'CHANGE_REQUEST_TO_INTENTOR')}
                style={{ marginTop: 8 }}
              >
                Submit
              </Button>
            </div>
          }
          title="Change Request to Indentor"
          trigger="click"
        >
          <Button size="small" style={{ color: '#fa8c16' }}>
            {pendingToIndentor ? 'Change Requested' : 'Request Change'}
          </Button>
        </Popover>
      </div>
    );
  }
}

  ];
} else {
  columns = [
    ...baseColumns,
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => status || 'N/A',
    },
     {
      title: `${role} Status`,
      key: 'indentorStatus',
      dataIndex: 'indentorStatus',
      render: (indentorStatus) => indentorStatus || 'N/A',
    },
     {
      title: `Store Purchase Officer Status`,
      key: 'sopStatus',
      dataIndex: 'sopStatus',
      render: (sopStatus) => sopStatus || 'N/A',
    },
   /* {
      title: 'Remarks',
      key: 'remarks',
      dataIndex: 'remarks',
      render: (remarks) => remarks || 'N/A',
    },*/
  
  {
  title: 'Accept',
  key: 'accept',
  render: (_, record) => {
    const indentorCanAct = record.canIndentorAct;
    return record.acceptanceStatus === 'ACCEPTED' ? (
      <Tag color="green">Accepted</Tag>
    ) : (
      <Button
        onClick={() => handleAccept(record)}
        size="small"
        disabled={!indentorCanAct}
      >
        Accept
      </Button>
    );
  }
},
{
  title: 'Reject',
  key: 'reject',
  render: (_, record) => {
    const indentorCanAct = record.canIndentorAct;
    return record.status === 'Rejected' ? (
      <span style={{ color: 'red' }}>Rejected</span>
    ) : (
      <Popover
        content={
          <div style={{ padding: 12 }}>
            <Input.TextArea
              placeholder="Enter reject comment"
              rows={3}
              value={rejectedVendorId === record.vendorId ? rejectComment : ''}
              onChange={(e) => {
                setRejectedVendorId(record.vendorId);
                setRejectComment(e.target.value);
              }}
            />
            <Button
              type="primary"
              onClick={() => handleReject(record)}
              style={{ marginTop: 8 }}
              disabled={!indentorCanAct}
            >
              Submit
            </Button>
          </div>
        }
        title="Reject Vendor"
        trigger="click"
      >
        <Button danger type="link" disabled={!indentorCanAct}>
          Reject
        </Button>
      </Popover>
    );
  }
},
{
  title: 'Seek Clarification',
  key: 'changeRequest',
  render: (_, record) => {
    const indentorCanAct = record.canIndentorAct;
    return record.status !== 'ChangeRequested' ? (
      <Popover
        content={
          <div style={{ padding: 12 }}>
            <Input.TextArea
              placeholder="Enter change request comment"
              rows={3}
              value={rejectedVendorId === record.vendorId ? rejectComment : ''}
              onChange={(e) => {
                setRejectedVendorId(record.vendorId);
                setRejectComment(e.target.value);
              }}
            />
            <Button
              type="primary"
              onClick={() => handleChangeRequest(record)}
              style={{ marginTop: 8 }}
              disabled={!indentorCanAct}
            >
              Submit
            </Button>
          </div>
        }
        title="Send Change Request"
        trigger="click"
      >
        <Button type="link" style={{ color: '#fa8c16' }} disabled={!indentorCanAct}>
          Change Request
        </Button>
      </Popover>
    ) : (
      <span style={{ color: '#fa8c16' }}>Requested</span>
    );
  }
}


  ];
}


  const TenderDetails = [
    {
      heading: "Tender Search",
      colCnt: 1,
      fieldList: [
        {
          name: "tenderId",
          label: "Tender Id",
          type: "search",
          span: 1,
          onSearch: () => handleSearchTender(), 
        }
      ]
    },

  ];

  const onFinish = () => {
    if (!tenderId) return message.error('Tender ID required');
    if (!quotationData.length) return message.error('No quotations to submit');
    message.success('Evaluation submitted');
  };

  return (
    <FormContainer>
      <Heading
        title={
          loadingTender
            ? 'Loading...'
            : `Tender Evaluation for Tender ID: ${formData.tenderId || '-'} and Bid Type: ${formData.bidType || '-'}`
        }
        subTitle={
          formData.totalValue
            ? `Approved Total Value: ${formData.totalValue}`
            : undefined
        }
      />

      <CustomForm
        formData={formData}
        onFinish={onFinish}
        onFinishFailed={() => message.error('Please check required fields')}
      >
        {renderFormFields(
          TenderDetails,
          handleChange,
          formData,
          '',
          null,
          setFormData,
          null
        )}
{showEvaluationSection &&  (
        <FormBody layout="vertical" style={{ marginTop: 16 }}>
          {notSubmittedVendors.length > 0 && (
            <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
              The following vendors have not submitted quotations: {notSubmittedVendors.join(', ')}
            </div>
          )}
          {(loadingQuotations || loadingTender) && <Spin tip="Loading..." style={{ marginBottom: 12 }} />}
          <Table
            dataSource={quotationData}
            columns={columns}
            rowKey="vendorId"
            pagination={false}
          />
          <TenderEvaluationHistory
            tenderId={tenderId}
            vendorId={selectedVendorForHistory}
            open={historyVisible}
            onCancel={() => setHistoryVisible(false)}
          />

          {/* Comparison Statement Upload Field */}
          {role !== 'Store Purchase Officer' && (
            <div style={{ marginTop: 16 }}>
              {renderFormFields(
                [
                  {
                    heading: "",
                    colCnt: 1,
                    fieldList: [
                    {
                      name: "comparationStatementFileName",
                      label: "Comparison Statement",
                      type: "multiImage",
                      required: true,
                      span: 1
                    }
                  ]
                }
              ],
              handleChange,
              formData,
              '',
              null,
              setFormData,
              null
            )}

        </div>)}


         {role !== 'Store Purchase Officer' && (  
          <div className="custom-btn" style={{ display: 'flex', gap: '10px', marginTop: 12 }}>
            <Btn onClick={handleSubmit} loading={isSubmitting} disabled={!canTakeAction}>
              Submit Quotation
            </Btn>
          </div>)}
        </FormBody>
      )}
      </CustomForm>
    </FormContainer>
  );
};

export default TenderEvaluator;
