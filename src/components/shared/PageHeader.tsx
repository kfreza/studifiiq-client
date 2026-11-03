export default function Cs_PageHeader({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        <h1 className="cs_display text-4xl sm:text-5xl">{title}</h1>
        {text && <p className="cs_prose">{text}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
