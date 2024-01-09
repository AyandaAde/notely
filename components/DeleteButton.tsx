"use client";

import { Trash } from "lucide-react"
import { Button } from "./ui/button"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/navigation";
import { Toaster, toast } from 'sonner'

type Props = {
    noteId: number
}

const DeleteButton = ({ noteId }: Props) => {
    const router = useRouter();
    const deleteNote = useMutation({
        mutationFn: async () => {
            const response = await axios.post("/api/deleteNote", {
                noteId,
            });

            return response.data;
        }

    })
    return (
        <>
            <Button
                variant={"destructive"}
                size="sm"
                disabled={deleteNote.isPending}
                onClick={() => {
                    const confirm = window.confirm("Are you sure you want to delete this note?");
                    if (!confirm) return;
                    deleteNote.mutate(undefined, {
                        onSuccess: () => {
                            toast.success('Notebook deleted successfully. Redirecting');
                            router.push("/dashboard");
                        },
                        onError: (err) => {
                            toast.error('Failed to delete Notebook. Please try again.');
                            console.error(err)
                        }
                    })
                }}
            >
                <Trash />
            </Button>
            <Toaster richColors />
        </>
    )
}

export default DeleteButton