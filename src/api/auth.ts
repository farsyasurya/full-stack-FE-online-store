export async function getMe() {
  const res = await fetch("http://localhost:3000/api/auth/me", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Gagal ambil data user");
  return res.json();
}
