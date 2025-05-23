import { useState } from "react";
import * as Linking from "expo-linking";
import { useSSO, useUser } from "@clerk/clerk-expo";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { GoogleIcon } from "@/assets/icons/google";
import useCustomToast from "@/hooks/useCustomToast";
import { Spinner } from "@/components/ui/spinner";

const AuthGoogleButton = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { toastSuccess, toastError } = useCustomToast();
  const { startSSOFlow } = useSSO();

  const handleAuth = async () => {
    try {
      setIsLoading(true);
      const { setActive, createdSessionId, authSessionResult, signIn } =
        await startSSOFlow({
          strategy: "oauth_google",
          redirectUrl: Linking.createURL("/", {
            scheme: "designdripmobile",
          }),
        });

      if (createdSessionId) {
        console.log("Session created", createdSessionId);
        setActive!({ session: createdSessionId });
        await user?.reload();

        if (authSessionResult?.type === "success") {
          toastSuccess("Logged in successfully!");
        }
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (error) {
      toastError("Error during Google SSO flow");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      variant="outline"
      action="secondary"
      className="w-full gap-1"
      disabled={isLoading}
      onPress={handleAuth}
    >
      <ButtonText className="font-medium">Continue with Google</ButtonText>
      {isLoading ? <Spinner size="small" /> : <ButtonIcon as={GoogleIcon} />}
    </Button>
  );
};

export default AuthGoogleButton;
