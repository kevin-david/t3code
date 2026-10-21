import type { EnvironmentMachineKind, ProjectIconOverride } from "@t3tools/contracts";
import { View } from "react-native";
import { AppText } from "./ui/AppText";
import { resolveProjectIconGlyph } from "../lib/projectIcon";
import { SymbolView, type AppSymbolName } from "./ui/AppSymbol";

export const ENVIRONMENT_MACHINE_SYMBOLS = {
  server: "server.rack",
  cloud: "cloud",
  linux: "terminal",
  desktop: "desktopcomputer",
  laptop: "laptopcomputer",
  "mac-mini": "macmini",
  "mac-studio": "macstudio",
} as const satisfies Record<EnvironmentMachineKind, AppSymbolName>;

export const ENVIRONMENT_MACHINE_KIND_LABELS: Record<EnvironmentMachineKind, string> = {
  server: "Server",
  cloud: "Cloud VM",
  linux: "Linux/WSL",
  desktop: "Desktop",
  laptop: "Laptop",
  "mac-mini": "Mini PC",
  "mac-studio": "Workstation",
};

export function EnvironmentMachineSymbol(props: {
  readonly kind: EnvironmentMachineKind;
  readonly customIcon?: ProjectIconOverride | null;
  readonly size: number;
  readonly tintColorClassName: string;
}) {
  const glyph = resolveProjectIconGlyph(props.customIcon, "Machine");
  if (glyph?.kind === "emoji") {
    return (
      <View style={{ width: props.size, height: props.size, alignItems: "center", justifyContent: "center" }}>
        <AppText allowFontScaling={false} style={{ fontSize: props.size * 0.85, lineHeight: props.size }}>
          {glyph.emoji}
        </AppText>
      </View>
    );
  }
  if (glyph?.kind === "monogram") {
    return (
      <View style={{ width: props.size, height: props.size, alignItems: "center", justifyContent: "center" }}>
        <AppText allowFontScaling={false} style={{ fontWeight: "700", fontSize: props.size * 0.65, lineHeight: props.size }}>
          {glyph.text}
        </AppText>
      </View>
    );
  }
  return (
    <SymbolView
      accessibilityLabel={ENVIRONMENT_MACHINE_KIND_LABELS[props.kind]}
      name={ENVIRONMENT_MACHINE_SYMBOLS[props.kind]}
      size={props.size}
      tintColorClassName={props.tintColorClassName}
      type="monochrome"
    />
  );
}
