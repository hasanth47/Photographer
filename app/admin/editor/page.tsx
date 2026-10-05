import type { Metadata } from "next";
import { PhotoEditor } from "./photo-editor";

export const metadata: Metadata = { title: "Photo editor" };

export default function AdminEditorPage() {
  return <PhotoEditor />;
}
