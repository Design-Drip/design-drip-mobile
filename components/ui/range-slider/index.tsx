"use client";
import React from "react";
import { createRangeSlider } from "@gluestack-ui/range-slider";
import { View, Pressable } from "react-native";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import {
  withStyleContext,
  useStyleContext,
} from "@gluestack-ui/nativewind-utils/withStyleContext";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { cssInterop } from "nativewind";

const SCOPE = "RANGE_SLIDER";
const Root = withStyleContext(View, SCOPE);
export const UIRangeSlider = createRangeSlider({
  Root: Root,
  Track: Pressable,
  LeftThumb: Pressable,
  RightThumb: Pressable,
  FilledTrack: View,
  ThumbInteraction: View,
});

cssInterop(UIRangeSlider.Track, { className: "style" });

const rangeSliderStyle = tva({
  base: "justify-center items-center data-[disabled=true]:opacity-40 data-[disabled=true]:web:pointer-events-none",
  variants: {
    orientation: {
      horizontal: "w-full",
      vertical: "h-full",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
    isReversed: {
      true: "",
      false: "",
    },
  },
});

const rangeSliderThumbStyle = tva({
  base: "bg-primary-500 absolute rounded-full data-[focus=true]:bg-primary-600 data-[active=true]:bg-primary-600 data-[hover=true]:bg-primary-600 data-[disabled=true]:bg-primary-500 web:cursor-pointer web:data-[active=true]:outline web:data-[active=true]:outline-4 web:data-[active=true]:outline-primary-400 shadow-hard-1",

  parentVariants: {
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    },
  },
});

const rangeSliderTrackStyle = tva({
  base: "bg-background-300 rounded-lg overflow-hidden",
  parentVariants: {
    orientation: {
      horizontal: "w-full",
      vertical: "h-full",
    },
    isReversed: {
      true: "",
      false: "",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  parentCompoundVariants: [
    {
      orientation: "horizontal",
      size: "sm",
      class: "h-1 flex-row",
    },
    {
      orientation: "horizontal",
      size: "sm",
      isReversed: true,
      class: "h-1 flex-row-reverse",
    },
    {
      orientation: "horizontal",
      size: "md",
      class: "h-1 flex-row",
    },
    {
      orientation: "horizontal",
      size: "md",
      isReversed: true,
      class: "h-[5px] flex-row-reverse",
    },
    {
      orientation: "horizontal",
      size: "lg",
      class: "h-1.5 flex-row",
    },
    {
      orientation: "horizontal",
      size: "lg",
      isReversed: true,
      class: "h-1.5 flex-row-reverse",
    },
    {
      orientation: "vertical",
      size: "sm",
      class: "w-1 flex-col-reverse",
    },
    {
      orientation: "vertical",
      size: "sm",
      isReversed: true,
      class: "w-1 flex-col",
    },
    {
      orientation: "vertical",
      size: "md",
      class: "w-[5px] flex-col-reverse",
    },
    {
      orientation: "vertical",
      size: "md",
      isReversed: true,
      class: "w-[5px] flex-col",
    },
    {
      orientation: "vertical",
      size: "lg",
      class: "w-1.5 flex-col-reverse",
    },
    {
      orientation: "vertical",
      size: "lg",
      isReversed: true,
      class: "w-1.5 flex-col",
    },
  ],
});

const rangeSliderFilledTrackStyle = tva({
  base: "bg-primary-500 data-[focus=true]:bg-primary-600 data-[active=true]:bg-primary-600 data-[hover=true]:bg-primary-600",
  parentVariants: {
    orientation: {
      horizontal: "h-full",
      vertical: "w-full",
    },
  },
});

type IRangeSliderProps = React.ComponentProps<typeof UIRangeSlider> &
  VariantProps<typeof rangeSliderStyle>;

const RangeSlider = React.forwardRef<
  React.ComponentRef<typeof UIRangeSlider>,
  IRangeSliderProps
>(function RangeSlider(
  {
    className,
    size = "md",
    orientation = "horizontal",
    isReversed = false,
    ...props
  },
  ref
) {
  return (
    <UIRangeSlider
      ref={ref}
      isReversed={isReversed}
      orientation={orientation}
      {...props}
      className={rangeSliderStyle({
        orientation,
        isReversed,
        class: className,
      })}
      context={{ size, orientation, isReversed }}
    />
  );
});

type IRangeSliderLeftThumbProps = React.ComponentProps<
  typeof UIRangeSlider.LeftThumb
> &
  VariantProps<typeof rangeSliderThumbStyle>;

const RangeSliderLeftThumb = React.forwardRef<
  React.ComponentRef<typeof UIRangeSlider.LeftThumb>,
  IRangeSliderLeftThumbProps
>(function RangeSliderThumb({ className, size, ...props }, ref) {
  const { size: parentSize } = useStyleContext(SCOPE);

  return (
    <UIRangeSlider.LeftThumb
      ref={ref}
      {...props}
      className={rangeSliderThumbStyle({
        parentVariants: {
          size: parentSize,
        },
        size,
        class: className,
      })}
    />
  );
});

type IRangeSliderRightThumbProps = React.ComponentProps<
  typeof UIRangeSlider.RightThumb
> &
  VariantProps<typeof rangeSliderThumbStyle>;

const RangeSliderRightThumb = React.forwardRef<
  React.ComponentRef<typeof UIRangeSlider.RightThumb>,
  IRangeSliderRightThumbProps
>(function RangeSliderThumb({ className, size, ...props }, ref) {
  const { size: parentSize } = useStyleContext(SCOPE);

  return (
    <UIRangeSlider.RightThumb
      ref={ref}
      {...props}
      className={rangeSliderThumbStyle({
        parentVariants: {
          size: parentSize,
        },
        size,
        class: className,
      })}
    />
  );
});

type IRangeSliderTrackProps = React.ComponentProps<typeof UIRangeSlider.Track> &
  VariantProps<typeof rangeSliderTrackStyle>;

const RangeSliderTrack = React.forwardRef<
  React.ComponentRef<typeof UIRangeSlider.Track>,
  IRangeSliderTrackProps
>(function RangeSliderTrack({ className, ...props }, ref) {
  const {
    orientation: parentOrientation,
    size: parentSize,
    isReversed,
  } = useStyleContext(SCOPE);

  return (
    <UIRangeSlider.Track
      ref={ref}
      {...props}
      className={rangeSliderTrackStyle({
        parentVariants: {
          orientation: parentOrientation,
          size: parentSize,
          isReversed,
        },
        class: className,
      })}
    />
  );
});

type IRangeSliderFilledTrackProps = React.ComponentProps<
  typeof UIRangeSlider.FilledTrack
> &
  VariantProps<typeof rangeSliderFilledTrackStyle>;

const RangeSliderFilledTrack = React.forwardRef<
  React.ComponentRef<typeof UIRangeSlider.FilledTrack>,
  IRangeSliderFilledTrackProps
>(function RangeSliderFilledTrack({ className, ...props }, ref) {
  const { orientation: parentOrientation } = useStyleContext(SCOPE);

  return (
    <UIRangeSlider.FilledTrack
      ref={ref}
      {...props}
      className={rangeSliderFilledTrackStyle({
        parentVariants: {
          orientation: parentOrientation,
        },
        class: className,
      })}
    />
  );
});

export {
  RangeSlider,
  RangeSliderLeftThumb,
  RangeSliderRightThumb,
  RangeSliderTrack,
  RangeSliderFilledTrack,
};
