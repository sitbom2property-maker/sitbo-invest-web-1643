/** Soft content protection: discourage copy / save / drag of page media & text. */

let shareCopyAllowance = 0;

/** Allow the next programmatic clipboard write (Share link button). */
export function allowShareCopy(ms = 1500): void {
  shareCopyAllowance += 1;
  window.setTimeout(() => {
    shareCopyAllowance = Math.max(0, shareCopyAllowance - 1);
  }, ms);
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  const el = target.closest(
    "input, textarea, select, [contenteditable='true'], [contenteditable=''], .allow-content-select",
  );
  return !!el;
}

function isAdminPath(): boolean {
  return typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
}

export function initContentProtection(): () => void {
  if (typeof window === "undefined") return () => {};

  const onContextMenu = (e: MouseEvent) => {
    if (isAdminPath() || isEditableTarget(e.target)) return;
    e.preventDefault();
  };

  const onCopyCut = (e: ClipboardEvent) => {
    if (shareCopyAllowance > 0) return;
    if (isAdminPath() || isEditableTarget(e.target)) return;
    e.preventDefault();
  };

  const onDragStart = (e: DragEvent) => {
    if (isAdminPath() || isEditableTarget(e.target)) return;
    const t = e.target;
    if (t instanceof HTMLImageElement || (t instanceof Element && t.closest("img, picture, svg, video, canvas"))) {
      e.preventDefault();
    }
  };

  const onSelectStart = (e: Event) => {
    if (isAdminPath() || isEditableTarget(e.target)) return;
    e.preventDefault();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (isAdminPath() || isEditableTarget(e.target)) return;
    const key = e.key.toLowerCase();
    const mod = e.ctrlKey || e.metaKey;
    if (!mod) return;
    // Block common copy / save / select-all / view-source shortcuts.
    if (key === "c" || key === "x" || key === "s" || key === "a" || key === "u") {
      e.preventDefault();
    }
  };

  document.addEventListener("contextmenu", onContextMenu, true);
  document.addEventListener("copy", onCopyCut, true);
  document.addEventListener("cut", onCopyCut, true);
  document.addEventListener("dragstart", onDragStart, true);
  document.addEventListener("selectstart", onSelectStart, true);
  document.addEventListener("keydown", onKeyDown, true);

  return () => {
    document.removeEventListener("contextmenu", onContextMenu, true);
    document.removeEventListener("copy", onCopyCut, true);
    document.removeEventListener("cut", onCopyCut, true);
    document.removeEventListener("dragstart", onDragStart, true);
    document.removeEventListener("selectstart", onSelectStart, true);
    document.removeEventListener("keydown", onKeyDown, true);
  };
}
