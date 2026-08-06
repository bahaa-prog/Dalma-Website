"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Undo,
  Redo,
} from "lucide-react";

export default function ArticleEditor({
  content,
  onChange,
  onRequestImageUpload,
}: {
  content: string;
  onChange: (html: string) => void;
  onRequestImageUpload: () => Promise<string | null>;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Image,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  async function insertImage() {
    const url = await onRequestImageUpload();
    if (url) editor!.chain().focus().setImage({ src: url }).run();
  }

  function toggleLink() {
    const previousUrl = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("رابط:", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="editor-wrap">
      <div className="editor-toolbar">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "active" : ""}>
          <BoldIcon size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "active" : ""}>
          <ItalicIcon size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? "active" : ""}>
          <Heading2 size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive("heading", { level: 3 }) ? "active" : ""}>
          <Heading3 size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "active" : ""}>
          <List size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "active" : ""}>
          <ListOrdered size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive("blockquote") ? "active" : ""}>
          <Quote size={16} />
        </button>
        <button type="button" onClick={toggleLink} className={editor.isActive("link") ? "active" : ""}>
          <LinkIcon size={16} />
        </button>
        <button type="button" onClick={insertImage}>
          <ImageIcon size={16} />
        </button>
        <span className="editor-toolbar-sep" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={16} />
        </button>
      </div>
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}
