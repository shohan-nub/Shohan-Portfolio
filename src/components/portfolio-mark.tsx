export function PortfolioMark({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="17.25" stroke="currentColor" strokeOpacity=".3" />
    <path d="M12.8 28V12.2h10.3M12.8 20h8.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M29 14.6c-.8-2.2-6.6-2.7-8.1-.3-1.5 2.4.5 4 4 5.1 3.1 1 4.8 2.1 4 4.8-.8 2.8-5.8 3.9-9 1.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <circle cx="31.3" cy="8.8" r="1.35" fill="#00B4D8" />
  </svg>;
}
