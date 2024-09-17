import { DialogContent, DialogTitle, DialogClose } from "./dialog";
import { IoCloseSharp } from "react-icons/io5";

export function DialogContentWrapper() {
    return (
        <DialogContent>
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <DialogTitle>Notificações</DialogTitle>
                    <DialogClose>
                        <IoCloseSharp className="size-6 text-zinc-600" />
                    </DialogClose>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="border-2 rounded-xl border-zinc-500 p-4 min-h-[100px]">
                        <h1 className="text-l font-bold">Tarefa atualizada</h1>
                        <p className="text-gray-500 line-clamp-2">A tarefa "Concluir relatório" foi atualizada.</p>
                    </div>
                    <div className="border-2 rounded-xl border-zinc-500 p-4 min-h-[100px]">
                        <h1 className="text-l font-bold">Tarefa criada</h1>
                        <p className="text-gray-500 line-clamp-2">A tarefa "Desenvolver projeto de estágio" foi criada.</p>
                    </div>
                    <div className="border-2 rounded-xl border-zinc-500 p-4 min-h-[100px]">
                        <h1 className="text-l font-bold">Tarefa criada</h1>
                        <p className="text-gray-500 line-clamp-2">A tarefa "Desenvolver projeto de práticas de extensão e enviar o vídeo no classroom" foi criada.</p>
                    </div>
                </div>
            </div>
        </DialogContent>
    )
}