import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { QueryProvider } from "./query-provider";
import { GluestackUIProvider } from "./ui/gluestack-ui-provider";
interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <GluestackUIProvider mode="system">
        <QueryProvider>{children}</QueryProvider>
      </GluestackUIProvider>
    </ClerkProvider>
  );
};
