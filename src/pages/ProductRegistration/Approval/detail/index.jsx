import { Fragment, lazy } from "react";
import { useLocation } from "react-router-dom";

const NewProductRegistrationApprovalDetail = lazy(() => import("./New/index"));
const RegistrationVariationNotificationApprovalDetail = lazy(() => import("./VariationNotification/index"));

const ApprovalDetail = () => {
  const location = useLocation();
  console.log(location.state);
  
  return (
    <Fragment>
      {location.state.registrationType === "New" && (
        <NewProductRegistrationApprovalDetail />
      )}
      {location.state.registrationType === "VariationNotification" && (
        <RegistrationVariationNotificationApprovalDetail />
      )}
    </Fragment>
  );
};

export default ApprovalDetail;
