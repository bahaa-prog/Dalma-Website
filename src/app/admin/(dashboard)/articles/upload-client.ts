export type UploadResult = { url: string; width: number; height: number };

export async function uploadImageFile(file: File): Promise<UploadResult | null> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    alert(data?.error ?? "فشل رفع الصورة.");
    return null;
  }
  return res.json();
}

/** Opens a native file picker and uploads whatever the admin selects. */
export function pickAndUploadImage(): Promise<UploadResult | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.onchange = async () => {
      const file = input.files?.[0];
      resolve(file ? await uploadImageFile(file) : null);
    };
    input.click();
  });
}
