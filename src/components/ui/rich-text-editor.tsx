"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  CheckSquare,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Toggle } from "~/components/ui/toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  editable?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  maxLength = 5000,
  className,
  editable = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const setLink = () => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("rounded-lg border", className)}>
      <div className="border-b p-2">
        <div className="flex flex-wrap items-center gap-1">
          <div className="flex items-center gap-1">
            <Toggle
              size="sm"
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("italic")}
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("underline")}
              onPressedChange={() =>
                editor.chain().focus().toggleUnderline().run()
              }
            >
              <UnderlineIcon className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("strike")}
              onPressedChange={() =>
                editor.chain().focus().toggleStrike().run()
              }
            >
              <Strikethrough className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("code")}
              onPressedChange={() => editor.chain().focus().toggleCode().run()}
            >
              <Code className="h-4 w-4" />
            </Toggle>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 1 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <Heading1 className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 2 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <Heading2 className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 3 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              <Heading3 className="h-4 w-4" />
            </Toggle>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
            <Toggle
              size="sm"
              pressed={editor.isActive("bulletList")}
              onPressedChange={() =>
                editor.chain().focus().toggleBulletList().run()
              }
            >
              <List className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("orderedList")}
              onPressedChange={() =>
                editor.chain().focus().toggleOrderedList().run()
              }
            >
              <ListOrdered className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("taskList")}
              onPressedChange={() =>
                editor.chain().focus().toggleTaskList().run()
              }
            >
              <CheckSquare className="h-4 w-4" />
            </Toggle>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "left" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("left").run()
              }
            >
              <AlignLeft className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "center" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
            >
              <AlignCenter className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "right" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("right").run()
              }
            >
              <AlignRight className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "justify" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
            >
              <AlignJustify className="h-4 w-4" />
            </Toggle>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
            <Toggle
              size="sm"
              pressed={editor.isActive("blockquote")}
              onPressedChange={() =>
                editor.chain().focus().toggleBlockquote().run()
              }
            >
              <Quote className="h-4 w-4" />
            </Toggle>
            <Button size="sm" variant="ghost" onClick={setLink}>
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" variant="ghost">
                  <Highlighter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    "#fbbf24",
                    "#34d399",
                    "#60a5fa",
                    "#f87171",
                    "#a78bfa",
                    "#fb7185",
                  ].map((color) => (
                    <button
                      key={color}
                      className="h-8 w-8 rounded border"
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        editor.chain().focus().setHighlight({ color }).run()
                      }
                    />
                  ))}
                  <button
                    className="h-8 w-8 rounded border bg-transparent"
                    onClick={() =>
                      editor.chain().focus().unsetHighlight().run()
                    }
                  >
                    ✕
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="min-h-[200px] p-4">
        <EditorContent
          editor={editor}
          className="prose prose-sm [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground max-w-none focus:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
        />
      </div>

      <div className="border-t px-4 py-2">
        <div className="text-muted-foreground flex justify-between text-sm">
          <span>
            {editor.storage.characterCount.characters()}/{maxLength} characters
          </span>
          <span>{editor.storage.characterCount.words()} words</span>
        </div>
      </div>
    </div>
  );
}
