import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../auth/Login";
import PageNotFound from "../pageNotFound/PageNotFound";
import Form3 from "../dashboard/indentModification/Form3";
import Form17 from "../dashboard/goodsTransfer/Form17";
import Form20 from "../dashboard/demandAndIssue/Form20";
import Form10 from "../dashboard/deliveryTracking/Form10";
import QueueTable from "../dashboard/queue/QueueTable";
import Form4a from "../dashboard/tenderRequest/Form4a";
import ReportsMain from "../reports/ReportsMain";
import CpReport from "../reports/CpReport";
import IndentReport from "../reports/IndentReport";
import TechnoMom from "../reports/TechnoMom";
import VendorContract from "../reports/VendorContractReport";
import ProcurementActivityReport from "../reports/ProcurementActivityReport";
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
import InvReportsMain from "../reports/InvReportsMain";
import GoodsIssueReport from "../reports/GoodsIssueReport";
import IgpReport from "../reports/IgpReport";
import OgpReport from "../reports/OgpReport";
import AssetReport from "../reports/AssetReport";
import StockReport from "../reports/StockReport";
import Tender from "../dashboard/tenderRequest/Tender";
import ContingencyPurchase from "../dashboard/contingencyPurchase/ContingencyPurchase";
import PO from "../dashboard/purchaseOrder/PO";
import SO from "../dashboard/serviceOrder/SO";
import Indent1 from "../dashboard/indentCreation/Indent1";
import CustomLayout from "../../components/DKG_CustomLayout";
import Quotations from '../dashboard/tenderRequest/Quotations';
import PoList from '../reports/PoList';
import SoList from '../reports/SoList';
import PoStatus from '../reports/PoStatus';
import SoStatus from "../reports/SoStatus";
import IndentList from "../reports/IndentList";
import QuarterlyVigilanceSoReport from '../reports/QuarterlyVigilanceSoReport';
import ShortClosedCancelledOrderReport from "../reports/ShortClosedCancelledOrderReport";
import MonthlyProcurementReport from "../reports/MonthlyProcurementReport";
import IndentStatus from '../reports/IndentStatus'
import TenderEvaluator from "../dashboard/tenderRequest/TenderEvaluator";
import TenderEvaluatorGem from "../dashboard/tenderRequest/TenderEvaluatorGem";
import ForDisposalAssets from "../dashboard/assetDisposal/ForDisposalAssets";
import { useSelector } from "react-redux";
import Invoice from "../dashboard/PaymentVoucher/Invoice";
/*
const RoutesComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<CustomLayout />}>
            <Route index element={<MainDashboard />} />
            <Route path="/queue" element={<QueueTable />} />
            <Route path="/masters" element={<Master />} />

            <Route path="/procurement">
              <Route path="indent">
                <Route path="creation" element={<Indent1 />} />
                <Route path="modification" element={<Form3 />} />
              </Route>
              <Route path="tender">
                <Route path="request" element={<Tender />} />
               <Route path="evaluationn" element={<Form4a />} />
               <Route path="evaluation" element={<TenderEvaluator />} />
               <Route path="gem" element={<TenderEvaluatorGem />} />
               <Route path="/procurement/tender/Quotations" element={<Quotations />} />
              </Route>
              <Route path="purchaseOrder" element={<PO />} />
              <Route path="serviceOrder" element={<SO />} />
              <Route path="contingencyPurchase" element={<ContingencyPurchase />} />
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
              <Route path="PoList" element={<PoList />} />
              <Route path="SoList" element={<SoList />} />
              <Route path="PoStatus" element={<PoStatus />} />
              <Route path="SoStatus" element={<SoStatus />} />
              <Route path="IndentList" element={<IndentList />} />
              <Route path="QuarterlyVigilanceSoReport" element={<QuarterlyVigilanceSoReport />} />
              <Route path="ShortClosedCancelledOrderReport" element={<ShortClosedCancelledOrderReport />} />
              <Route path="MonthlyProcurementReport" element={<MonthlyProcurementReport />} />
              <Route path="IndentStatus" element={<IndentStatus />} />
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
              <Route path="goodsIssue" element={<Isn />} />
              <Route path="goodsTransfer" element={<Form17 />} />
              <Route path="materialDisposal" element={<AssetDisposal />} />
              <Route path="ForDisposalAssets" element={<ForDisposalAssets />} />
              <Route path="outward" element={<Ogp />} />
              <Route path="inward" element={<Igp />} />
              <Route path="demandIssue" element={<Form20 />} />
            </Route>
          </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesComponent;*/
// Default: first role

const indentCreatorRoutes = (
  <>
    <Route path="/masters" element={<Master />} />
    <Route path="/procurement/indent/creation" element={<Indent1 />} />
    <Route path="/procurement/tender/evaluation" element={<TenderEvaluator />} />
    <Route path="/inventory/goodsInspection" element={<GoodsInspection />} />
    <Route path="/inventory/demandIssue" element={<Form20 />} />
    <Route path="/procurement/tender/Quotations" element={<Quotations />} />
  </>
);

const storePurchaseRoutes = (
  <>
     <Route path="/procurement/tender/request" element={<Tender />} />
     <Route path="/procurement/tender/evaluation" element={<TenderEvaluator />} />
    <Route path="/procurement/tender/gem" element={<TenderEvaluatorGem />} />
    <Route path="/procurement/tender/Quotations" element={<Quotations />} />
    <Route path="/inventory/goodsReceipt" element={<Grn />} />
    <Route path="/inventory/goodsInspection" element={<GoodsInspection />} />
    <Route path="/inventory/goodsReturn" element={<Grv />} />
    <Route path="/inventory/goodsIssue" element={<Isn />} />
    <Route path="/inventory/materialDisposal" element={<AssetDisposal />} />
    <Route path="/inventory/outward" element={<Ogp />} />
    <Route path="/inventory/inward" element={<Igp />} />
    <Route path="/inventory/goodsTransfer" element={<Form17 />} />
    
  </>
);


const storePersonRoutes = (
  <>
    <Route path="/masters" element={<Master />} />
    <Route path="/inventory/gprn" element={<GPRN />} />
    <Route path="/inventory/goodsInspection" element={<GoodsInspection />} />
    <Route path="/inventory/goodsReturn" element={<Grv />} />
    <Route path="/inventory/goodsReceipt" element={<Grn />} />
    <Route path="/inventory/goodsIssue" element={<Isn />} />
    <Route path="/inventory/assetMaster" element={<Asset />} />
    <Route path="/inventory/goodsTransfer" element={<Form17 />} />
    <Route path="/inventory/materialDisposal" element={<AssetDisposal />} />
     <Route path="/inventory/ForDisposalAssets" element={<ForDisposalAssets />} />
    <Route path="/inventory/outward" element={<Ogp />} />
    <Route path="/inventory/inward" element={<Igp />} />
   

  </>
);


const purchasePersonnelRoutes = (
  <>

    <Route path="/procurement/tender/request" element={<Tender />} />
    <Route path="/procurement/tender/evaluation" element={<TenderEvaluator />} />
    <Route path="/procurement/tender/gem" element={<TenderEvaluatorGem />} />
    <Route path="/procurement/tender/Quotations" element={<Quotations />} />
   
    
      <Route path="/procurement/purchaseOrder" element={<PO />} />
              <Route path="/procurement/serviceOrder" element={<SO />} />

  </>
);

const generateRoutes = (roleName) => {
  switch (roleName) {
    case "Indent Creator":
      return indentCreatorRoutes;
    case "Store Purchase Officer":
      return storePurchaseRoutes;
    case "Store Person":
      return storePersonRoutes;
    case "Purchase personnel":
      return purchasePersonnelRoutes;
    default:
      return null;
  }
};

const RoutesComponent = () => {
  const auth = useSelector((state) => state.auth);
  const roleName=auth.role;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<CustomLayout />}>
          <Route index element={<MainDashboard />} />
          <Route path="/queue" element={<QueueTable />} />

          {/* Reports - Common for all */}
          <Route path="/reports" element={<ReportsMain />}>
            <Route path="cpReport" element={<CpReport />} />
            <Route path="indentReport" element={<IndentReport />} />
            <Route path="technoMom" element={<TechnoMom />} />
            <Route path="vendorContract" element={<VendorContract />} />
            <Route path="procurementActivity" element={<ProcurementActivityReport />} />
            <Route path="PoList" element={<PoList />} />
            <Route path="SoList" element={<SoList />} />
            <Route path="PoStatus" element={<PoStatus />} />
            <Route path="SoStatus" element={<SoStatus />} />
            <Route path="IndentList" element={<IndentList />} />
            <Route path="QuarterlyVigilanceSoReport" element={<QuarterlyVigilanceSoReport />} />
            <Route path="ShortClosedCancelledOrderReport" element={<ShortClosedCancelledOrderReport />} />
            <Route path="MonthlyProcurementReport" element={<MonthlyProcurementReport />} />
            <Route path="IndentStatus" element={<IndentStatus />} />
          </Route>

          <Route path="/invReports" element={<InvReportsMain />}>
            <Route path="goodsIssue" element={<GoodsIssueReport />} />
            <Route path="igp" element={<IgpReport />} />
            <Route path="ogp" element={<OgpReport />} />
            <Route path="asset" element={<AssetReport />} />
            <Route path="stock" element={<StockReport />} />
          </Route>

           <Route path="/procurement/contingencyPurchase" element={<ContingencyPurchase />} />
           <Route path="/procurement/paymentVoucher/Invoice" element={<Invoice />} />
          {/* Role-based routes only for roleId 1 */}
          {generateRoutes(roleName)}
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesComponent;
