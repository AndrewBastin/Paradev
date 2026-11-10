export type SetupStepAgent = "claude" | "codex";

export const SETUP_STEP_AGENTS: SetupStepAgent[] = ["claude", "codex"];

export interface SetupStepRows {
	git: boolean;
	gitHub: boolean;
	claude: boolean;
	codex: boolean;
}

type InstallStatus = { installed: boolean } | undefined;

export interface SetupStepStatus {
	/** Undefined when detection failed; never blocks on an unknown. */
	git: InstallStatus;
	gh: { installed: boolean; authenticated: boolean } | undefined;
	claude?: InstallStatus;
	codex?: InstallStatus;
	/** Paradev installs agents itself only on a Mac. */
	canInstallAgents?: boolean;
}

/** Each row shows only when that tool is missing. */
export function setupStepRows({
	git,
	gh,
	claude,
	codex,
	canInstallAgents = false,
}: SetupStepStatus): SetupStepRows {
	return {
		git: git?.installed === false,
		gitHub: gh !== undefined && !(gh.installed && gh.authenticated),
		claude: canInstallAgents && claude?.installed === false,
		codex: canInstallAgents && codex?.installed === false,
	};
}

export function needsSetupStep(rows: SetupStepRows): boolean {
	return rows.git || rows.gitHub || rows.claude || rows.codex;
}

/** The agent rows still worth a skip warning: none once any agent is installed. */
export function agentsStillMissing(
	rows: SetupStepRows,
	status: Pick<SetupStepStatus, "claude" | "codex">,
): SetupStepAgent[] {
	if (SETUP_STEP_AGENTS.some((agent) => status[agent]?.installed)) return [];
	return SETUP_STEP_AGENTS.filter((agent) => rows[agent]);
}
