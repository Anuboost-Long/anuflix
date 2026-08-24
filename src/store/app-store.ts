import type { AdminWorkspace } from "@/types/navigation";
import { atom } from "jotai";

export const sidebarOpenAtom = atom(true);
export const activeWorkspaceAtom = atom<AdminWorkspace>("overview");
