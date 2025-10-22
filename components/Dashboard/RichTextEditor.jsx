import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

const RichTextEditor = ({
  content,
  onChange,
  editable = true,
  placeholder = "Start typing...",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        underline: false, // disable built-in underline
        link: false, // disable built-in link
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-primary-600 dark:text-primary-400 underline hover:text-primary-700 dark:hover:text-primary-300 cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor && editor.isEditable !== editable) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  const setLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="rich-text-editor">
      {editable && (
        <div className="border-b border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-800 p-2 flex flex-wrap gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors ${
              editor.isActive("bold")
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                : "text-dark-600 dark:text-dark-300"
            }`}
            type="button"
            title="Bold"
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors ${
              editor.isActive("italic")
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                : "text-dark-600 dark:text-dark-300"
            }`}
            type="button"
            title="Italic"
          >
            <Italic size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors ${
              editor.isActive("underline")
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                : "text-dark-600 dark:text-dark-300"
            }`}
            type="button"
            title="Underline"
          >
            <UnderlineIcon size={18} />
          </button>

          <div className="w-px bg-dark-300 dark:bg-dark-600 mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors ${
              editor.isActive("bulletList")
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                : "text-dark-600 dark:text-dark-300"
            }`}
            type="button"
            title="Bullet List"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors ${
              editor.isActive("orderedList")
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                : "text-dark-600 dark:text-dark-300"
            }`}
            type="button"
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </button>

          <div className="w-px bg-dark-300 dark:bg-dark-600 mx-1" />

          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors ${
              editor.isActive("link")
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                : "text-dark-600 dark:text-dark-300"
            }`}
            type="button"
            title="Add Link"
          >
            <LinkIcon size={18} />
          </button>

          <div className="w-px bg-dark-300 dark:bg-dark-600 mx-1" />

          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors ${
              editor.isActive({ textAlign: "left" })
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                : "text-dark-600 dark:text-dark-300"
            }`}
            type="button"
            title="Align Left"
          >
            <AlignLeft size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors ${
              editor.isActive({ textAlign: "center" })
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                : "text-dark-600 dark:text-dark-300"
            }`}
            type="button"
            title="Align Center"
          >
            <AlignCenter size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors ${
              editor.isActive({ textAlign: "right" })
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                : "text-dark-600 dark:text-dark-300"
            }`}
            type="button"
            title="Align Right"
          >
            <AlignRight size={18} />
          </button>
        </div>
      )}

      <EditorContent
        editor={editor}
        className={`prose prose-sm dark:prose-invert max-w-none p-4 ${
          editable
            ? "min-h-[300px] bg-white dark:bg-dark-900 focus-within:ring-2 focus-within:ring-primary-400"
            : "bg-transparent"
        }`}
      />

      <style>{`
        .ProseMirror {
          outline: none;
          color: #1f2937 !important;
        }

        .dark .ProseMirror {
          color: #f3f4f6 !important;
        }

        .ProseMirror * {
          color: inherit !important;
        }

        .ProseMirror p {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        .ProseMirror p:first-child {
          margin-top: 0;
        }

        .ProseMirror p:last-child {
          margin-bottom: 0;
        }

        .ProseMirror strong {
          font-weight: 700;
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror u {
          text-decoration: underline;
        }

        .ProseMirror a {
          color: #3b82f6 !important;
          text-decoration: underline;
        }

        .dark .ProseMirror a {
          color: #60a5fa !important;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        .ProseMirror ul {
          list-style-type: disc;
        }

        .ProseMirror ol {
          list-style-type: decimal;
        }

        .ProseMirror li {
          margin-top: 0.25em;
          margin-bottom: 0.25em;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
