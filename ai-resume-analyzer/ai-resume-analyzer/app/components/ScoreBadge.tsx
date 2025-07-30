const ScoreBadge = ({ score }: { score: number }) => {
  // Determine badge style and text based on score
  const getBadgeConfig = (score: number) => {
    if (score > 69) {
      return {
        bgClass: "bg-green-100",
        textClass: "text-green-600",
        label: "Strong",
      };
    } else if (score > 49) {
      return {
        bgClass: "bg-yellow-100",
        textClass: "text-yellow-600",
        label: "Good Start",
      };
    } else {
      return {
        bgClass: "bg-red-100",
        textClass: "text-red-600",
        label: "Needs Work",
      };
    }
  };

  const { bgClass, textClass, label } = getBadgeConfig(score);

  return (
    <div
      className={`${bgClass} ${textClass} px-3 py-1 rounded-full text-sm font-medium inline-flex items-center`}
    >
      <p>{label}</p>
    </div>
  );
};

export default ScoreBadge;
