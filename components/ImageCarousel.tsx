import React, { useRef } from "react";
import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Image } from "@/components/ui/image";

export interface ImageItem {
  id: string;
  url: string;
  view_side: "front" | "back" | "left" | "right";
  is_primary?: boolean;
}

interface ImageCarouselProps {
  images: ImageItem[];
  height?: number;
  width?: number;
  autoPlay?: boolean;
  showThumbnails?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ImageCarousel({
  images,
  height = 400,
  width = SCREEN_WIDTH,
  autoPlay = false,
  showThumbnails = true,
}: ImageCarouselProps) {
  const ref = useRef<ICarouselInstance>(null);
  const progressValue = useSharedValue(0);

  // Sort images to ensure front view is first
  const sortedImages = [...images].sort((a, b) => {
    if (a.view_side === "front") return -1;
    if (b.view_side === "front") return 1;
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return 0;
  });

  const renderItem = ({ item }: { item: ImageItem }) => {
    return (
      <View style={{ width, height, justifyContent: "center" }}>
        <Image
          source={{ uri: item.url }}
          className="w-full h-full"
          alt={`Product view ${item.view_side}`}
          resizeMode="cover"
        />
      </View>
    );
  };

  const handlePressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progressValue.value,
      animated: true,
    });
  };

  const renderThumbnail = (image: ImageItem, index: number) => {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        borderColor: progressValue.value === index ? "#3b82f6" : "transparent",
        borderWidth: progressValue.value === index ? 2 : 0,
        opacity: withTiming(progressValue.value === index ? 1 : 0.7),
      };
    });

    return (
      <Pressable
        key={image.id}
        onPress={() => handlePressPagination(index)}
        style={{ marginRight: 8 }}
      >
        <Animated.View style={[styles.thumbnailWrapper, animatedStyle]}>
          <Image
            source={{ uri: image.url }}
            className="w-full h-full"
            alt={`Thumbnail ${image.view_side}`}
            resizeMode="cover"
          />
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View>
      <Carousel
        ref={ref}
        width={width}
        height={height}
        data={sortedImages}
        renderItem={renderItem}
        onProgressChange={progressValue}
        loop={true}
        autoPlay={autoPlay}
        autoPlayInterval={5000}
        pagingEnabled={true}
        mode="parallax"
      />
      {showThumbnails && sortedImages.length > 1 && (
        <View className="flex-row justify-center items-center mt-2">
          {sortedImages.map((image, index) => renderThumbnail(image, index))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  thumbnailWrapper: {
    height: 60,
    width: 60,
    borderRadius: 4,
    overflow: "hidden",
  },
});
