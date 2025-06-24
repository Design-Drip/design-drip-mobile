import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import useWishlist from "@/features/wishlist/hooks/useWishlist";
import { Heart } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { useEffect } from "react";

type ProductWishlistButtonProps = {
  id?: string;
};

const ProductWishlistButton = ({ id }: ProductWishlistButtonProps) => {
  const { isInWishlist, addItem, removeItem } = useWishlist();
  const isFavorite = id ? isInWishlist(id) : false;

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    if (isFavorite) {
      // Scale up and bounce slightly when added to favorites
      scale.value = withSequence(
        withSpring(1.3, { damping: 2 }),
        withSpring(1, { damping: 3 })
      );
    } else {
      // Simple scale animation when removed
      scale.value = withSpring(1);
    }
  }, []);

  const handleWishlistToggle = () => {
    if (!id) return;

    if (isFavorite) {
      removeItem(id);
      scale.value = withSpring(1);
    } else {
      addItem(id);
      // Add extra bounce animation on add
      scale.value = withSequence(
        withSpring(1.3, { damping: 2 }),
        withSpring(1, { damping: 3 })
      );
    }
  };

  return (
    <Button
      variant={isFavorite ? "solid" : "outline"}
      size="sm"
      onPress={handleWishlistToggle}
      className={isFavorite ? "border-pink-500" : ""}
    >
      <Animated.View style={animatedStyle}>
        <Icon
          as={Heart}
          className={
            isFavorite ? "fill-pink-500 text-pink-500" : "text-gray-600"
          }
          size="sm"
        />
      </Animated.View>
    </Button>
  );
};

export default ProductWishlistButton;
