import Card from "@/components/common/Card";
import { Badge } from "@/components/fields/Badge";

function MainCard({
  title,
  subtitle,
  badgeTitle,
  badgeSubtitle,
  badgeSubtitleColor,
  titleBody,
  titleBodyBadge,
  titleBodyBadgeColor = "green",
  children,
  className = "",
  scrollable = false,
  maxHeight = "400px",
  rightContent,
}) {
  const getStatusColor = (status) => {
    if (!status) return "gray";
    const s = status.toLowerCase();
    if (s === "completed") return "green";
    if (s === "rejected" || s === "terminated") return "red";
    if (s === "in progress" || s === "started") return "blue";
    return "gray";
  };

  return (
    <>
      <Card
        className={`mb-4 ${className}`}
        scrollable={scrollable}
        maxHeight={maxHeight}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between rounded-t-lg px-4 py-2.5 -mx-4 -mt-4 mb-4 border-b"
          style={{ background: "#e9eef5" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-gray-700">{title}</span>
            {badgeTitle && <Badge color="white" variant="filled">{badgeTitle}</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-gray-700">
              {subtitle}
            </span>
            {badgeSubtitle && (
              <Badge
                color={badgeSubtitleColor || getStatusColor(badgeSubtitle)}
              >
                {badgeSubtitle}
              </Badge>
            )}
            {rightContent}
          </div>
        </div>
        {/* body */}
        {titleBody && (
          <div className="flex items-center justify-between mb-2 mt-1">
            <span className="font-semibold text-xl">{titleBody}</span>
            {titleBodyBadge && (
              <Badge className="mr-1" color={titleBodyBadgeColor}>
                {titleBodyBadge}
              </Badge>
            )}
          </div>
        )}
        {/* Content */}
        {children}
      </Card>
    </>
  );
}

export default MainCard;
