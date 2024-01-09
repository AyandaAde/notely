"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect, useMemo, useRef, useState } from "react";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "./ui/button";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { NoteType } from "@/lib/db/schema";
import Text from "@tiptap/extension-text";
import { Loader2 } from "lucide-react";
import { useCompletion } from "ai/react";
import { Separator } from "./ui/separator";

type Props = {
    note: NoteType
}

const TipTapEditor = ({ note }: Props) => {
    const [editorState, setEditorState] = useState(note.editorState || `<h1>${note.name}</h1>`);
    const { complete, completion } = useCompletion({
        api: "/api/completion",
    });
    const saveNote = useMutation({
        mutationFn: async () => {
            const response = await axios.post("/api/saveNote", {
                noteId: note.id,
                editorState
            });
            return response.data;
        },
    });
    const customText = Text.extend({
        addKeyboardShortcuts() {
            return {
                "Shift-a": () => {
                    const prompt = this.editor.getText().split(" ").slice(-30).join(" ");
                    complete(prompt);
                    return true;
                },
            };
        },
    });
    const editor = useEditor({
        autofocus: true,
        extensions: [StarterKit, customText],
        content: editorState,
        onUpdate: ({ editor }) => {
            setEditorState(editor.getHTML());
        },
    });
    //auto complete functionality
    const lastCompletion = useRef("");
    useEffect(() => {
        if (!completion || !editor) return;
        const diff = completion.slice(lastCompletion.current.length);
        lastCompletion.current = completion;
        editor.commands.insertContent(diff);
    }, [completion, editor]);
    const debouncedEditorState = useDebounce(editorState, 500);
    useEffect(() => {
        //save to db
        if (debouncedEditorState === "") return;
        saveNote.mutate(undefined, {
            onSuccess: data => {
                console.log("successfully updated!", data);
            },
            onError: err => {
                console.error(err)
            }
        });
        console.log(debouncedEditorState);
    }, [debouncedEditorState]);
    return (
        <>
            <div className="flex">
                {editor && <TipTapMenuBar editor={editor} />}

                {saveNote.isPending ?
                    (
                        <Button className="ml-[10px]" disabled variant={"outline"}>
                            <Loader2 className="animate-spin" size="sm" />
                            Saving...
                        </Button>
                    )

                    : <Button className="ml-[10px]" disabled variant={"outline"}>Saved</Button>}

            </div>
            <div className="prose prose-sm w-full mt-4">
                <EditorContent editor={editor} />
            </div>
            <div className="h-4"></div>
            <Separator className="mb-[5px] bg-zinc-600 w-full" />
            <span className="text-sm">
                Tip: Press{" "}
                <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg ">Shift + A</kbd>{" "}
                for AI autocompletion.
            </span>

        </>
    )
}

export default TipTapEditor