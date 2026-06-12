const H1 = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h1 className={`text-4xl font-light ${className}`}>{children}</h1>
);

const H2 = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-3xl font-light ${className}`}>{children}</h2>
);

const H3 = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-2xl font-normal ${className}`}>{children}</h3>
);

const H4 = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h4 className={`text-xl font-normal ${className}`}>{children}</h4>
);

const BodyLg = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-lg font-normal ${className}`}>{children}</p>
);

const BodyMd = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-base font-normal ${className}`}>{children}</p>
);

const BodySm = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-gray-400 ${className}`}>{children}</p>
);

const Typography = { H1, H2, H3, H4, BodyLg, BodyMd, BodySm };

export default Typography;
