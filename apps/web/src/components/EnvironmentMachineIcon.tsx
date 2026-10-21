import type { EnvironmentMachineKind, ProjectIconOverride } from "@t3tools/contracts";
import { CloudIcon, LaptopIcon, MonitorIcon, ServerIcon, type LucideProps } from "lucide-react";
import { createElement, type FunctionComponent, type SVGProps } from "react";
import { LinuxIcon } from "./Icons";
import { ProjectMonogram } from "./ProjectMonogram";
import { projectIconColorClassName } from "../projectIconColors";
import { lucideIconByName } from "../lib/lucideIconByName";
import { cn } from "~/lib/utils";

function LucideLike(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

function MacMiniIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <LucideLike {...props}>
      <rect width="20" height="8" x="2" y="8" rx="2" />
      <path d="M6 12h.01" />
    </LucideLike>
  );
}

function MacStudioIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <LucideLike {...props}>
      <rect width="18" height="14" x="3" y="5" rx="2" />
      <path d="M7 15h.01M11 15h.01M15 15h.01" />
    </LucideLike>
  );
}

const ICON_BY_KIND: Record<EnvironmentMachineKind, FunctionComponent<LucideProps>> = {
  server: ServerIcon,
  cloud: CloudIcon,
  linux: LinuxIcon,
  desktop: MonitorIcon,
  laptop: LaptopIcon,
  "mac-mini": MacMiniIcon,
  "mac-studio": MacStudioIcon,
};

export const ENVIRONMENT_MACHINE_KIND_LABELS: Record<EnvironmentMachineKind, string> = {
  server: "Server",
  cloud: "Cloud VM",
  linux: "Linux/WSL",
  desktop: "Desktop",
  laptop: "Laptop",
  "mac-mini": "Mini PC",
  "mac-studio": "Workstation",
};

export function environmentMachineIcon(
  kind: EnvironmentMachineKind,
): FunctionComponent<LucideProps> {
  return ICON_BY_KIND[kind];
}

export function EnvironmentMachineIcon({
  kind,
  customIcon,
  className,
  ...props
}: LucideProps & {
  readonly kind: EnvironmentMachineKind;
  readonly customIcon?: ProjectIconOverride | null;
}) {
  // A missing override preserves the existing icon on every surface.
  if (customIcon?.kind === "emoji") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-3.5 shrink-0 items-center justify-center leading-none [container-type:size]",
          className,
        )}
      >
        <span className="text-[length:80cqh] leading-none">{customIcon.emoji}</span>
      </span>
    );
  }
  if (customIcon?.kind === "monogram") {
    return (
      <ProjectMonogram
        text={customIcon.text}
        color={customIcon.color}
        className={className}
      />
    );
  }
  if (customIcon?.kind === "lucide") {
    const Icon = lucideIconByName(customIcon.name) ?? ICON_BY_KIND[kind];
    return createElement(Icon, {
      ...props,
      className: cn(projectIconColorClassName(customIcon.color), className),
    });
  }
  const Icon = ICON_BY_KIND[kind];
  return <Icon {...props} className={className} />;
}
