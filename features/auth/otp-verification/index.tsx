import { useState } from "react";
import { Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";

import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react-native";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import useCustomToast from "@/hooks/useCustomToast";
import { AuthLayout } from "../components/AuthLayout";
import Logo from "@/assets/images/logo.svg";
import { Spinner } from "@/components/ui/spinner";

const OtpVerification = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { toastSuccess, toastError } = useCustomToast();

  const handleVerify = async () => {
    if (!isLoaded) return;
    if (!code || code.length < 6) {
      setError("Please enter a valid verification code");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        toastSuccess("Signed up successfully!");
        router.replace("/");
      } else {
        throw new Error("Verification failed");
      }
    } catch (err) {
      toastError("Error during OTP verification");
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleVerify();
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      toastSuccess("Verification code resent!");
    } catch (err) {
      toastError("Failed to resend verification code");
    }
  };

  return (
    <AuthLayout>
      <VStack className="max-w-[440px] w-full h-full p-4" space="4xl">
        <VStack className="items-center">
          <Logo width={150} height={150} />
          <Heading className="text-center" size="3xl">
            Email Verification
          </Heading>
          <Text className="text-center mt-2 text-typography-500">
            Enter the verification code that was sent to your email
          </Text>
        </VStack>

        <VStack className="items-center" space="xl">
          <FormControl isInvalid={!!error}>
            <Input className="w-full">
              <InputField
                className="text-xl text-center tracking-wider"
                placeholder="Enter 6-digit code"
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={setCode}
                onSubmitEditing={handleKeyPress}
                returnKeyType="done"
              />
            </Input>
            {error ? (
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle} />
                <FormControlErrorText>{error}</FormControlErrorText>
              </FormControlError>
            ) : null}
          </FormControl>

          <VStack className="w-full mt-4" space="md">
            <Button
              className="w-full"
              onPress={handleVerify}
              isDisabled={!code || isSubmitting}
            >
              {isSubmitting ? <Spinner size="small" /> : null}
              <ButtonText className="font-medium">Verify</ButtonText>
            </Button>

            <HStack className="justify-center items-center mt-4" space="sm">
              <Text size="sm" className="text-typography-500">
                Didn't receive a code?
              </Text>
              <Button variant="link" onPress={handleResendCode}>
                <ButtonText className="text-primary-700 font-medium">
                  Resend Code
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </AuthLayout>
  );
};

export default OtpVerification;
