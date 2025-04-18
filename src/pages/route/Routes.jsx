import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import PrivateRoutes from "./PrivateRoutes";
import LayoutWithDashboard from "./LayoutWithDashboard";
import Login from "../auth/Login";
import PageNotFound from "../pageNotFound/PageNotFound";
import SmsDutyEnd from "../dashboard/duty/sms/endDuty/SmsDutyEnd";
import SmsBloomInspection from "../dashboard/duty/sms/bloomInspection/SmsBloomInspection";
import ShiftReports from "../dashboard/duty/sms/shiftReports/ShiftReports";
import SmsHeatList from "../dashboard/duty/sms/heatList/SmsHeatList";
import SmsCheckList from "../dashboard/duty/sms/checkList/SmsCheckList";
import SmsVerification from "../dashboard/duty/sms/verification/SmsVerification";
import SmsHeatSummary from "../dashboard/duty/sms/heatSummary/SmsHeatSummary";
import VIShiftDetailsForm from "../dashboard/duty/visualInspection/shiftDetails/ShiftDetailsForm";
import Home from "../dashboard/duty/visualInspection/home/Home";
import VIShiftSummary from "../dashboard/duty/visualInspection/shiftSummary/VIShiftSummary";
import VisualInspectionForm from "../dashboard/duty/visualInspection/inspection/VisualInspectionForm";
import StageShiftDetailsForm from "../dashboard/duty/stage/rollingStage/shiftDetails/ShiftDetailsForm";
import StageHome from "../dashboard/duty/stage/rollingStage/home/Home";
import NDTStartDutyForm from "../dashboard/duty/ndt/shiftDetails/StartDutyForm";
import NDTHome from "../dashboard/duty/ndt/home/Home";
import NCalibrationForm from "../dashboard/duty/ndt/calibration/NCalibrationForm";
import NReport from "../dashboard/duty/ndt/report/NReport";
import SmsDutyStartForm from "../dashboard/duty/sms/startDuty/SmsDutyStartForm";
import CalibrationList from '../dashboard/duty/calibration/calibrationList/CalibrationList';
import NewCalibrationForm from '../dashboard/duty/calibration/newCalibration/NewCalibrationForm';
import BulkCalibrationForm from '../dashboard/duty/calibration/bulkCalibration/BulkCalibrationForm';
import QctSampleList from '../dashboard/duty/qct/qctSampleList/QctSampleList';
import QctSampleDeclarationForm from '../dashboard/duty/qct/newSampleDeclaration/QctSampleDeclarationForm';
import SrInspectionHome from '../dashboard/duty/srInspection/srInspectionHome/SrInspectionHome';
import SrNewInspectionForm from '../dashboard/duty/srInspection/srNewInspection/SrNewInspectionForm';
import WsRemarks from '../dashboard/duty/srInspection/wsRemarks/WsRemarks';
import TestSampleList from '../dashboard/duty/stage/testSampleMarking/testSampleList/TestSampleList';
import NewTestSampleDeclaration from "../dashboard/duty/stage/testSampleMarking/newTestSample/NewTestSampleDeclaration";
import RollingControlForm from "../dashboard/duty/stage/rollingStage/rollingControl/RollingControlForm";
import HtSequence from "../dashboard/duty/stage/rollingStage/htSequence/HtSequence";
import WeldingStartDutyForm from "../dashboard/duty/welding/startDuty/WeldingStartDutyForm";
import WeldingHome from "../dashboard/duty/welding/home/WeldingHome";
import NewWeldInspection from "../dashboard/duty/welding/newWeld/NewWeldInspection";
import HeldRejectedPanel from '../dashboard/duty/welding/heldRejectedPanel/HeldRejectedPanel';
import WeldingSummary from '../dashboard/duty/welding/shiftSummary/WeldingSummary';
import WeldTestSample from "../dashboard/duty/welding/testSample/WeldTestSample";
import TLTTestDetails from "../dashboard/duty/welding/TLTTestDetails/TLTTestDetails";
import HardnessTestDetails from "../dashboard/duty/welding/HardnessTestDetails/HardnessTestDetails";
import MicroTestDetails from "../dashboard/duty/welding/MicroTestDetails/MicroTestDetails";
import MacroTestDetails from '../dashboard/duty/welding/MacroTestDetails/MacroTestDetails';
import TestingHome from "../dashboard/duty/testing/testHome/TestingHome";
import PendingTestSamples from "../dashboard/duty/testing/pendingTestSamples/PendingTestSamples";
import TestingReport from "../dashboard/duty/testing/shiftTestingReport/TestingReport";
import HeatPending from "../dashboard/duty/testing/pendingHeats/HeatPending";
import RailDetails from "../dashboard/duty/railDetails/RailDetails";
import SmsPrivateRoute from "./SmsPrivateRoute";
import HeatDtl from "../dashboard/duty/sms/heatDtl/HeatDtl";
import RollingPrivateRoute from "./RollingPrivateRoute";
import RollingControlSample from "../dashboard/duty/stage/rollingStage/rollingControl60E1/RollingControlSample";
import RollingVerification from "../dashboard/duty/stage/rollingVerification/RollingVerification";
import FinishingVerification from "../dashboard/duty/stage/finishingVerification/FinishingVerification";
import Form1 from "../dashboard/indentCreation/Form1";
import Form3 from "../dashboard/indentModification/Form3";
import Form4 from "../dashboard/tenderRequest/Form4";
import Form5 from "../dashboard/tenderEvaluation/Form5";
import Form11 from "../dashboard/goodsProvisionalRecieptNote/Form11";
import Form12 from "../dashboard/goodsInspection/Form12";
import Form13 from "../dashboard/goodsReturn/Form13";
import Form14 from "../dashboard/goodsReceiptInspection/Form14";
import Form15 from "../dashboard/assterMaster/Form15";
import Form16 from "../dashboard/goodsIssue/Form16";
import Form17 from "../dashboard/goodsTransfer/Form17";
import Form18 from "../dashboard/materialDisposal/Form18";
import Form19 from "../dashboard/gatePass/Form19";
import Form20 from "../dashboard/demandAndIssue/Form20";
import Form7 from "../dashboard/purchaseOrder/Form7";
import Form7a from "../dashboard/serviceOrder/Form7a";
import Form7b from "../dashboard/contingencyPurchase/Form7b";
import Form6 from "../dashboard/communityNomination/Form6";
import Form9 from "../dashboard/performanceWarranty/Form9";
import Form10 from "../dashboard/deliveryTracking/Form10";
import QueueTable from "../dashboard/queue/QueueTable";
import Form4a from "../dashboard/tenderRequest/Form4a";
import MaterialForm from "../dashboard/materialDetails/MaterialForm";
import ReportsMain from "../reports/ReportsMain";
import CpReport from "../reports/CpReport";
import IndentReport from "../reports/IndentReport";
import TechnoMom from "../reports/TechnoMom";
import VendorContract from "../reports/VendorContractReport";
import ProcurementActivityReport from "../reports/ProcurementActivityReport";
import Temp from "../dashboard/goodsProvisionalRecieptNote/GPRN";
import MainDashboard from "../dashboard/newDashboard/MainDashboard";
import GPRN from "../dashboard/goodsProvisionalRecieptNote/GPRN";
import GoodsInspection from "../dashboard/goodsInspection/GoodsInspection";
import JobCreation from "../dashboard/jobCreation/JobCreation";
import WorkCreation from "../dashboard/workCreation/WorkCreation";
import Master from "../masters/Master";
import Grv from "../dashboard/grv/Grv";
import Grn from "../dashboard/grn/Grn";
import Isn from "../dashboard/isn/Isn";
import Ogp from "../dashboard/ogp/Ogp";
import Igp from "../dashboard/igp/Igp";
import Asset from "../dashboard/asset/Asset";
import AssetDisposal from "../dashboard/assetDisposal/AssetDisposal";
import Test from "../../components/Test";
import InvReportsMain from "../reports/InvReportsMain";
import GoodsIssueReport from "../reports/GoodsIssueReport";
import IgpReport from "../reports/IgpReport";
import OgpReport from "../reports/OgpReport";
import AssetReport from "../reports/AssetReport";
import StockReport from "../reports/StockReport";
import Indent from "../dashboard/indentCreation/Indent";
import Tender from "../dashboard/tenderRequest/Tender";
import ContingencyPurchase from "../dashboard/contingencyPurchase/Contingency";
// import SmsRecord from "../dashboard/records/SmsRecord";

const RoutesComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<LayoutWithDashboard />}>
            <Route index element={<Dashboard />} />
            {/* <Route path="/record/sms" element={<SmsRecord />} /> */}

            <Route path="/dashboard" element={<MainDashboard/>} />
            <Route path="/queue" element={<QueueTable/>}/>
            <Route path="/masters" element={<Master />} />

            <Route path="/procurement">
                <Route path="indent">
                    <Route path="creation" element={<Form1 />} />
                    <Route path="temp" element={<Indent />} />
                    <Route path="modification" element={<Form3 />} />
                </Route>
                <Route path="tender">
                    <Route path="request" element={<Form4 />} />
                    <Route path="evaluation" element={<Form4a />} />
                    <Route path="temp" element={<Tender />} />
                </Route>
                <Route path="purchaseOrder" element={<Form7 />} />
                <Route path="serviceOrder" element={<Form7a />} />
                <Route path="contingencyPurchase" element={<Form7b />} />
                <Route path="temp" element={<ContingencyPurchase/>} />
                <Route path="jobCreation" element={<JobCreation />} />
                <Route path="workCreation" element={<WorkCreation />} />
                <Route path="deliveryTracking" element={<Form10 />} />
            </Route>

            <Route path="/reports" element={<ReportsMain />}>
                <Route path="cpReport" element={<CpReport />} />
                <Route path="indentReport" element={<IndentReport />} />
                <Route path="technoMom" element={<TechnoMom />} />
                <Route path="vendorContract" element={<VendorContract />} />
                <Route path="procurementActivity" element={<ProcurementActivityReport />} />
            </Route>
            <Route path="/invReports" element={<InvReportsMain />}>
                <Route path="goodsIssue" element={<GoodsIssueReport />} />
                <Route path="igp" element={<IgpReport />} />
                <Route path="ogp" element={<OgpReport />} />
                <Route path="asset" element={<AssetReport />} />
                <Route path="stock" element={<StockReport />} />
            </Route>


            <Route path="/inventory">
                <Route path="gprn" element={<GPRN />} />
                <Route path="goodsInspection" element={<GoodsInspection />} />
                <Route path="goodsReturn" element={<Grv />} />
                <Route path="goodsReceipt" element={<Grn />} />
                <Route path="assetMaster" element={<Asset />} />
                <Route path="goodsIssue" element={<Isn/>} />
                <Route path="goodsTransfer" element={<Form17 />} />
                <Route path="materialDisposal" element={<AssetDisposal />} />
                <Route path="outward" element={<Ogp />} />
                <Route path="inward" element={<Igp />} />
                <Route path="demandIssue" element={<Form20 />} />
            </Route>
          </Route>


        </Route>



        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesComponent;
