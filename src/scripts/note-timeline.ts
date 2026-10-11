const timeline = document.querySelector<HTMLOListElement>("[data-note-timeline]");
const notes = Array.from(document.querySelectorAll<HTMLElement>("[data-note-id]"));
const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-note-anchor]"));
const toast = document.querySelector<HTMLElement>("[data-copy-toast]");

if (timeline) {
  let toastTimer = 0;
  let scrollFrame = 0;

  const getHashId = () => decodeURIComponent(window.location.hash.slice(1));
  const getNoteById = (id: string) => notes.find((note) => note.id === id);
  const hasFocusedNote = () => Boolean(getNoteById(getHashId()));

  const focusNote = (targetNote?: HTMLElement) => {
    timeline.toggleAttribute("data-has-focus", Boolean(targetNote));
    notes.forEach((note) => {
      note.toggleAttribute("data-focused", note === targetNote);
      note.toggleAttribute("data-dimmed", Boolean(targetNote) && note !== targetNote);
    });
  };

  const focusNoteFromHash = () => {
    focusNote(getNoteById(getHashId()));
  };

  const getMainNoteInViewport = () => {
    const focusLine = Math.min(window.innerHeight * 0.28, 220);
    const passedNotes = notes.filter((note) => note.getBoundingClientRect().top <= focusLine);

    if (passedNotes.length > 0) {
      return passedNotes.at(-1);
    }

    return notes.find((note) => note.getBoundingClientRect().bottom > 0);
  };

  const syncFocusWithScroll = () => {
    scrollFrame = 0;
    if (!hasFocusedNote()) return;

    const mainNote = getMainNoteInViewport();
    if (!mainNote || mainNote.id === getHashId()) return;

    const url = new URL(window.location.href);
    url.hash = mainNote.id;
    window.history.replaceState(null, "", url);
    focusNote(mainNote);
  };

  const requestScrollFocusSync = () => {
    if (!hasFocusedNote() || scrollFrame) return;

    scrollFrame = window.requestAnimationFrame(syncFocusWithScroll);
  };

  const showToast = () => {
    if (!toast) return;

    window.clearTimeout(toastTimer);
    toast.setAttribute("data-visible", "true");
    toastTimer = window.setTimeout(() => {
      toast.removeAttribute("data-visible");
    }, 1300);
  };

  const copyText = async (value: string) => {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard API is not available.");
    }

    await navigator.clipboard.writeText(value);
  };

  anchors.forEach((anchor) => {
    anchor.addEventListener("click", async (event) => {
      event.preventDefault();

      const url = new URL(window.location.href);
      url.hash = anchor.hash;
      window.history.pushState(null, "", url);
      focusNoteFromHash();
      getNoteById(getHashId())?.scrollIntoView({ block: "start" });

      try {
        await copyText(url.toString());
        showToast();
      } catch {
        window.location.href = url.toString();
      }
    });
  });

  window.addEventListener("hashchange", focusNoteFromHash);
  window.addEventListener("popstate", focusNoteFromHash);
  window.addEventListener("scroll", requestScrollFocusSync, { passive: true });
  focusNoteFromHash();
}
