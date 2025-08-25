import { Info } from "@/components/Dexain";

const SubmissionHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <Info
        label="Registration Submission Monitoring"
        labelClassName="font-bold text-black text-xl"
        value={(
          <p className="text-muted-foreground font-medium text-sm">
            Monitor and review the ongoing registration submission activities.
          </p>
        )}
      />
    </div>
  );
};

export default SubmissionHeader;