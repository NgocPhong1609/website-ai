export type StoredUser = {
  id?: number | string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  avatar?: string | null;
  roles?: Array<{ name?: string } | string>;
};

export function readStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem("userInfo");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function writeStoredUser(user: Partial<StoredUser> | null) {
  if (typeof window === "undefined") return;

  if (!user) {
    window.localStorage.removeItem("userInfo");
    return;
  }

  const current = readStoredUser() ?? {};
  window.localStorage.setItem(
    "userInfo",
    JSON.stringify({
      ...current,
      ...user,
      avatar_url: user.avatar_url ?? user.avatar ?? current.avatar_url ?? current.avatar ?? null,
      avatar: user.avatar ?? user.avatar_url ?? current.avatar ?? current.avatar_url ?? null,
    })
  );

  window.dispatchEvent(new Event("user:updated"));
}
