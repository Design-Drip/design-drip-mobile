import { QueryProvider } from "./query-provider";
import { GluestackUIProvider } from "./ui/gluestack-ui-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <GluestackUIProvider mode="light">
      <QueryProvider>{children}</QueryProvider>
    </GluestackUIProvider>
  );
};
