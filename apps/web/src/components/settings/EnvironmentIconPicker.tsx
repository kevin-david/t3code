import {
  AuthSettingsWriteScope,
  ENVIRONMENT_MACHINE_KINDS,
  isEnvironmentMachineKind,
  resolveEnvironmentMachineKind,
  type ProjectIconOverride,
  type EnvironmentId,
  type ServerConfig,
} from "@t3tools/contracts";

import { lazy, Suspense, useState } from "react";
import { useUpdateEnvironmentSettings } from "../../hooks/useSettings";
import { useEnvironmentScope } from "../../state/session";
import { ENVIRONMENT_MACHINE_KIND_LABELS, EnvironmentMachineIcon } from "../EnvironmentMachineIcon";
import {
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from "../ui/menu";

const ProjectIconPickerDialog = lazy(() =>
  import("./ProjectIconPickerDialog").then((module) => ({
    default: module.ProjectIconPickerDialog,
  })),
);

export function resolveEnvironmentIconPickerLock(input: {
  readonly serverConfig: Pick<ServerConfig, "environment"> | null;
  readonly operateAccess: "granted" | "denied" | "pending";
}): string | null {
  if (input.serverConfig === null) {
    return "Connect to this environment to change its icon.";
  }
  if (input.serverConfig.environment.capabilities.environmentIcon !== true) {
    return "This environment's server is too old to keep an icon. Update it to choose one.";
  }
  if (input.operateAccess !== "granted") {
    return "Your session on this environment cannot change its settings.";
  }
  return null;
}

export function EnvironmentIconMenu({
  environmentId,
  serverConfig,
}: {
  readonly environmentId: EnvironmentId;
  readonly serverConfig: Pick<ServerConfig, "environment"> | null;
}) {
  const updateSettings = useUpdateEnvironmentSettings(environmentId);
  const [pickerOpen, setPickerOpen] = useState(false);
  const operateAccess = useEnvironmentScope(environmentId, AuthSettingsWriteScope)
    ? "granted"
    : "denied";
  const lock = resolveEnvironmentIconPickerLock({ serverConfig, operateAccess });
  const detected = serverConfig?.environment.platform.machine ?? "server";
  const resolved = resolveEnvironmentMachineKind(serverConfig);
  const customIcon = serverConfig?.settings?.environmentCustomIcon ?? null;

  return (
    <>
    <MenuSub>
      <MenuSubTrigger>
        <EnvironmentMachineIcon kind={resolved} customIcon={customIcon} />
        Icon
      </MenuSubTrigger>
      <MenuSubPopup>
        <MenuItem disabled={lock !== null || serverConfig?.environment.capabilities.environmentCustomIcon !== true} onClick={() => setPickerOpen(true)}>
          Choose custom icon…
        </MenuItem>
        {customIcon !== null ? (
          <MenuItem disabled={lock !== null} onClick={() => updateSettings({ environmentCustomIcon: null })}>
            Reset custom icon
          </MenuItem>
        ) : null}
        <MenuSeparator />
        {lock !== null ? (
          <>
            <MenuItem disabled className="whitespace-normal">
              {lock}
            </MenuItem>
            <MenuSeparator />
          </>
        ) : null}
        <MenuRadioGroup
          value={resolved}
          onValueChange={(next) => {
            if (lock !== null || !isEnvironmentMachineKind(next)) return;
            updateSettings({ environmentIcon: next === detected ? null : next });
          }}
        >
          {ENVIRONMENT_MACHINE_KINDS.map((kind) => (
            <MenuRadioItem key={kind} value={kind} disabled={lock !== null}>
              <span className="flex min-w-0 items-center gap-2">
                <EnvironmentMachineIcon kind={kind} className="size-3.5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">
                  {ENVIRONMENT_MACHINE_KIND_LABELS[kind]}
                </span>
                {kind === detected ? (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {serverConfig?.environment.platform.machine ? "detected" : "default"}
                  </span>
                ) : null}
              </span>
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuSubPopup>
    </MenuSub>
    {pickerOpen ? (
      <Suspense fallback={null}>
        <ProjectIconPickerDialog
          current={customIcon}
          projectName={serverConfig?.environment.label ?? "Environment"}
          title="Choose environment icon"
          open
          onOpenChange={setPickerOpen}
          onSelect={(icon: ProjectIconOverride) => updateSettings({ environmentCustomIcon: icon })}
        />
      </Suspense>
    ) : null}
    </>
  );
}
