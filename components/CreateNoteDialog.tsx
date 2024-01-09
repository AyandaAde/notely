"use client";
import { Loader2, Plus } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster, toast } from 'sonner'

type Props = {}

const CreateNoteDialog = (props: Props) => {
    const router = useRouter();
    const [input, setInput] = useState("");
    const uploadToFirebase = useMutation({
        mutationFn: async (noteId: String) => {
            const response = await axios.post("/api/uploadToFirebase", {
                noteId
            })
            return response.data;
        }
    })
    const createNoteBook = useMutation({
        mutationFn: async () => {
            const response = await axios.post("/api/createNoteBook", {
                name: input,
            });
            return response.data;
        }
    });
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input === "") {
            window.alert("Please enter a name for your notebook");
            return;
        }
        createNoteBook.mutate(undefined, {
            onSuccess({ note_id }) {
                console.log("created new note", { note_id });
                uploadToFirebase.mutate(note_id);
                toast.success('New notebook created!... Redirecting');
                router.push(`/notebook/${note_id}`);
            },
            onError(error) {
                toast.error('Failed to create new notebook. Please try again.');
                console.error(error);
            }
        })
    }
    return (
        <>
            <Dialog>
                <DialogTrigger>
                    <div className="border-dashed flex border-2 border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
                        <Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
                        <h2 className="font-semibold text-green-600 sm:mt-2">New Note Book</h2>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            New Note Book
                        </DialogTitle>
                        <DialogDescription>
                            You can create a new note by clicking the button below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Name..." />
                        <div className="h-4" />
                        <div className="flex items-center gap-2">
                            <DialogClose asChild>
                                <Button
                                    type="reset"
                                    variant={"secondary"}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            {createNoteBook.isPending ? (
                                <>
                                    <Button type="submit" className="bg-green-600" disabled={createNoteBook.isPending}>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                                    </Button>
                                </>
                            )
                                : (
                                    <Button type="submit" className="bg-green-600" disabled={createNoteBook.isPending}>
                                        Create
                                    </Button>
                                )
                            }
                        </div>
                        {createNoteBook.isPending && (
                            <p>Do not refresh page</p>
                        )}
                    </form>
                </DialogContent>
            </Dialog>
            <Toaster richColors />
        </>
    )
}

export default CreateNoteDialog