import { useState } from "react";
import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useSignIn } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";

import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { AlertTriangle, CheckIcon } from "lucide-react-native";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { HStack } from "@/components/ui/hstack";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Button, ButtonText } from "@/components/ui/button";
import { LinkText } from "@/components/ui/link";

import { AuthLayout } from "../components/AuthLayout";
import useCustomToast from "@/hooks/useCustomToast";
import { loginSchema, type LoginSchemaType } from "./lib/schema";
import SigninGoogleButton from "../components/AuthGoogleButton";
import Logo from "@/assets/images/logo.svg";

const LoginContent = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });
  const { toastSuccess, toastError } = useCustomToast();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: LoginSchemaType) => {
    if (!isLoaded) return;
    try {
      const signInAttempt = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        toastSuccess("Logged in successfully!");
        reset();
        router.replace("/");
      } else {
        throw new Error("Login failed!");
      }
    } catch (error) {
      toastError("Login failed!");
    }
  };

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };
  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  return (
    <VStack className="max-w-[440px] w-full h-full" space="4xl">
      <VStack className="items-center">
        <Logo width={275} height={275} />
        <Heading size="2xl">Welcome to Design Drip</Heading>
      </VStack>
      <VStack className="items-center" space="md">
        <VStack className="w-full" space="md">
          <VStack space="xl" className="w-full">
            <FormControl isInvalid={!!errors?.identifier} className="w-full">
              <Controller
                defaultValue=""
                name="identifier"
                control={control}
                rules={{
                  validate: async (value) => {
                    try {
                      await loginSchema.parseAsync({ email: value });
                      return true;
                    } catch (error: any) {
                      return error.message;
                    }
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      autoCapitalize="none"
                      placeholder="Enter email or username"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      onSubmitEditing={handleKeyPress}
                      returnKeyType="done"
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon as={AlertTriangle} />
                <FormControlErrorText>
                  {errors?.identifier?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            {/* Label Message */}
            <FormControl isInvalid={!!errors.password} className="w-full">
              <Controller
                defaultValue=""
                name="password"
                control={control}
                rules={{
                  validate: async (value) => {
                    try {
                      await loginSchema.parseAsync({ password: value });
                      return true;
                    } catch (error: any) {
                      return error.message;
                    }
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      onSubmitEditing={handleKeyPress}
                      returnKeyType="done"
                    />
                    <InputSlot onPress={handleState} className="pr-3">
                      <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                    </InputSlot>
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon as={AlertTriangle} />
                <FormControlErrorText>
                  {errors?.password?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            <HStack className="w-full justify-between ">
              <Controller
                name="rememberme"
                defaultValue={false}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    size="sm"
                    value="Remember me"
                    isChecked={value}
                    onChange={onChange}
                    aria-label="Remember me"
                  >
                    <CheckboxIndicator>
                      <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                    <CheckboxLabel className="font-medium ">
                      Remember me
                    </CheckboxLabel>
                  </Checkbox>
                )}
              />
            </HStack>
          </VStack>

          <Button className="w-full" onPress={handleSubmit(onSubmit)}>
            <ButtonText className="font-medium">Log in</ButtonText>
          </Button>

          <SigninGoogleButton />
        </VStack>
      </VStack>
      <HStack className="self-center" space="sm">
        <Text size="md">Don't have an account?</Text>
        <Link href="/(auth)/sign-up" asChild replace>
          <LinkText
            className="font-medium text-primary-700 group-hover/link:text-primary-600  group-hover/pressed:text-primary-700"
            size="md"
          >
            Sign up
          </LinkText>
        </Link>
      </HStack>
    </VStack>
  );
};

export default function SignIn() {
  return (
    <AuthLayout>
      <LoginContent />
    </AuthLayout>
  );
}
