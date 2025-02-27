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
// import SmsRecord from "../dashboard/records/SmsRecord";

const RoutesComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<LayoutWithDashboard />}>
            <Route index element={<Dashboard />} />
            {/* <Route path="/record/sms" element={<SmsRecord />} /> */}

            <Route path="/queue" element={<QueueTable/>}/>

            <Route path="/procurement">
                <Route path="indent">
                    <Route path="creation" element={<Form1 />} />
                    <Route path="modification" element={<Form3 />} />
                </Route>
                <Route path="tender">
                    <Route path="request" element={<Form4 />} />
                    <Route path="evaluation" element={<Form4a />} />
                </Route>
                <Route path="purchaseOrder" element={<Form7 />} />
                <Route path="serviceOrder" element={<Form7a />} />
                <Route path="contingencyPurchase" element={<Form7b />} />
                <Route path="committeeFormation" element={<Form6 />} />
                <Route path="performanceWarranty" element={<Form9 />} />
                <Route path="deliveryTracking" element={<Form10 />} />
            </Route>

            <Route path="/inventory">
                <Route path="gprn" element={<Form11 />} />
                <Route path="goodsInspection" element={<Form12 />} />
                <Route path="goodsReturn" element={<Form13 />} />
                <Route path="goodsReceipt" element={<Form14 />} />
                <Route path="assetMaster" element={<Form15 />} />
                <Route path="goodsIssue" element={<Form16/>} />
                <Route path="goodsTransfer" element={<Form17 />} />
                <Route path="materialDisposal" element={<Form18 />} />
                <Route path="gatePass" element={<Form19 />} />
                <Route path="demandIssue" element={<Form20 />} />
            </Route>

            <Route path="/sms">
              <Route index element={<SmsDutyStartForm />} />
              <Route path="dutyStart" element={<SmsDutyStartForm />} />
              <Route element={<SmsPrivateRoute />}>
                <Route path="heatSummary" element={<SmsHeatSummary />} />
                <Route path="heatDtl" element={<HeatDtl />} />
                <Route path="dutyEnd" element={<SmsDutyEnd />} />
                <Route path="bloomInspection" element={<SmsBloomInspection />} />
                <Route path="shiftReports">
                  <Route index element={<ShiftReports />} />
                  <Route path="heatList" element={<SmsHeatList />} />
                  <Route path="checkList" element={<SmsCheckList />} />
                  <Route path="verification" element={<SmsVerification />} />
                </Route>
              </Route>
            </Route>

            <Route path="/stage">
              <Route index element={<StageShiftDetailsForm />} />
              <Route path="startDuty" element={<StageShiftDetailsForm />} />
              <Route element={<RollingPrivateRoute />}>
                <Route path="home" element={<StageHome />} />
                <Route path="rollingControl" element={<RollingControlForm />} />
                <Route path="rollingControl/rollingControlSample" element={<RollingControlSample />} />
                <Route path="rollingVerification" element={<RollingVerification />} />
                <Route path="finishingVerification" element={<FinishingVerification />} />
                <Route path="htSequence" element={<HtSequence />} />
                <Route path="testSampleMarkingList" element={<TestSampleList />} />
                <Route path="newTestSampleDeclaration" element={<NewTestSampleDeclaration />} />
              </Route>
            </Route>

            <Route path="/ndt">
              <Route index element={<NDTStartDutyForm />} />
              <Route path="startDuty" element={<NDTStartDutyForm />} />
              <Route path="home" element={<NDTHome />} />
              <Route path="calibration" element={<NCalibrationForm />} />
              <Route path="report" element={<NReport />} />
            </Route>

            <Route path="/testing">
              <Route index element={<TestingHome />} />
              <Route path="home" element={<TestingHome />} />
              <Route path="pendingTestSamples" element={<PendingTestSamples />} />
              <Route path="testingReport" element={<TestingReport />} />
              <Route path="heatPending" element={<HeatPending />} />
              <Route path="report" element={<NReport />} />
            </Route>

            <Route path="/visual">
              <Route index element={<VIShiftDetailsForm />} />
              <Route path="startDuty" element={<VIShiftDetailsForm />} />
              <Route path="home" element={<Home />} />
              <Route path="inspection" element={<VisualInspectionForm />} />
              <Route path="summary" element={<VIShiftSummary />} />
            </Route>

            <Route path="/welding">
              <Route index element={<WeldingStartDutyForm />} />
              <Route path="startDuty" element={<WeldingStartDutyForm />} />
              <Route path="home" element={<WeldingHome />} />
              <Route path="newWeldInspection" element={<NewWeldInspection />} />
              <Route path="heldRejectedPanel" element={<HeldRejectedPanel />} />
              <Route path="testSample" element={<WeldTestSample />} />
              <Route path="tltTestDetails" element={<TLTTestDetails />} />
              <Route path="hardnessTestDetails" element={<HardnessTestDetails />} />
              <Route path="microTestDetails" element={<MicroTestDetails />} />
              <Route path="macroTestDetails" element={<MacroTestDetails />} />
              <Route path="shiftSummary" element={<WeldingSummary />} />
            </Route>

            <Route path="/srInspection">
              <Route index element={<SrInspectionHome />} />
              <Route path="addNewInspection" element={<SrNewInspectionForm />} />
              <Route path="wsRemarks" element={<WsRemarks />} />
            </Route>

            <Route path="/qct">
              <Route index element={<QctSampleList />} />
              <Route path="sampleList" element={<QctSampleList />} />
              <Route path="newSampleDeclaration" element={<QctSampleDeclarationForm />} />
            </Route>

            <Route path='/calibration'>
              <Route index element={<CalibrationList />} />
              <Route path='list' element={<CalibrationList />} />
              <Route path='newModifyCalibration' element={<NewCalibrationForm />} />
              <Route path='bulkCalibration' element={<BulkCalibrationForm  />} />
            </Route>

            {/* <Route path="/railDetails">
              <Route index element={<SmsDutyStartForm />} />
              <Route path="railId" element={<SmsHeatSummary />} />
            </Route> */}
            <Route path="/railDetails/:railId" element={<RailDetails />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesComponent;
