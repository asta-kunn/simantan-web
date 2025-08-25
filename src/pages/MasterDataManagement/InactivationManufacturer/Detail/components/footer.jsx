import { Button } from "@/components/Dexain";
import { ArrowLeft, Check, Loader2, ShieldCheck, X } from "lucide-react";

const FooterInactiveDetailManufacturer = ({
  goBack,
  isManager = false,
  loading = false,
  handleApprove,
  handleReject,
  handleReactivate,
  data
}) => {
  const isCompleted = data?.STATUS === "COMPLETED";
  const isRejected = data?.STATUS === "REJECTED";
  const isWaiting = data?.STATUS === "WAITING APPROVAL";

  const renderActions = () => {
    
    if ((isCompleted || isRejected) && isManager) return null;

    if (isManager) {
      return (
        <div className="flex items-center flex-row gap-2">
          <Button onClick={handleApprove} disabled={loading} className="mt-2">
            {loading ? <Loader2 className="animate-spin" /> : <Check />} Approve
          </Button>
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={loading}
            className="mt-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <X />} Reject
          </Button>
        </div>
      );
    }

    if(isWaiting) return null;

    return (
      <Button className="mt-2" onClick={handleReactivate} disabled={loading}>
        <ShieldCheck /> Reactivate
      </Button>
    );
  };

  

  return (
    <div className="flex items-center justify-between flex-row gap-2">
      <Button variant="outline" className="mt-2" onClick={goBack}>
        <ArrowLeft /> Back
      </Button>
      {renderActions()}
    </div>
  );
};

export default FooterInactiveDetailManufacturer;
