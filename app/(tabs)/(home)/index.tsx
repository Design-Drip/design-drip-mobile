import { Button, ButtonText } from "@/components/ui/button";
import useCustomToast from "@/hooks/useCustomToast";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { toastSuccess, toastError } = useCustomToast();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Button onPress={() => toastSuccess("This is a success message!")}>
        <ButtonText>Show Success Toast</ButtonText>
      </Button>
      <Button onPress={() => toastError("This is a error message!")}>
        <ButtonText>Show Error Toast</ButtonText>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
