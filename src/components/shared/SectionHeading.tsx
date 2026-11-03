export default function Cs_SectionHeading({
  title,
  text,
  action,
}: {
  title: string;
  text?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        <h2 className="cs_section_title">{title}</h2>
        {text && <p className="cs_prose">{text}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
