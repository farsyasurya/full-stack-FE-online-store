export async function getMe() {
  const res = await fetch(
    "https://full-stack-be-online-store-production.up.railway.app/api/auth/me",
    {
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Gagal ambil data user");
  return res.json();
}
