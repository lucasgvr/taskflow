import { UserNotifications } from "../UserNotifications";
import { DialogContent, DialogTitle, DialogClose } from "./dialog";
import { IoCloseSharp } from "react-icons/io5";
import { useAuth } from "../../hooks/useAuth";

export function DialogContentWrapper() {
    const { currentUser } = useAuth();

    if (!currentUser) return null;
    
    const departmentId = currentUser.department._key.path.segments[currentUser.department._key.path.segments.length - 1]

    return (
        <DialogContent>
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <DialogTitle>Notificações</DialogTitle>
                    <DialogClose>
                        <IoCloseSharp className="size-6 text-zinc-600" />
                    </DialogClose>
                </div>

                <UserNotifications userId={currentUser.id} departmentId={departmentId} />
            </div>
        </DialogContent>
    )
}