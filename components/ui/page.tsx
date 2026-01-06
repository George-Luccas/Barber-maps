export const PageContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`space-y-6 p-5 ${className ?? ""}`}>{children}</div>;
};

export const PageSectionTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <h3 className="text-xs font-bold uppercase">{children}</h3>;
};

export const PageSectionContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`space-y-3 ${className ?? ""}`}>{children}</div>;
};

export const PageSectionScroller = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  );
};
