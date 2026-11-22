import SplitText from "./SplitText.jsx";

export default function SectionHeader({ label, title, children }) {
  return (
    <div className="section-header">
      <div>
        <p className="section-label" data-fade>{label}</p>
        <SplitText as="h2" className="section-title" text={title} />
      </div>
      {children && <div className="section-header__aside" data-fade>{children}</div>}
    </div>
  );
}
