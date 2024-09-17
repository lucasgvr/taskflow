import * as DialogPrimitive from '@radix-ui/react-dialog'

export function Dialog(props) {
	return <DialogPrimitive.Dialog {...props} />
}

export function DialogTrigger(props) {
	return <DialogPrimitive.DialogTrigger {...props} />
}

export function DialogClose(props) {
	return <DialogPrimitive.DialogClose {...props} />
}

export function DialogPortal(props) {
	return <DialogPrimitive.DialogPortal {...props} />
}

export function DialogOverlay(props) {
	return (
		<DialogPrimitive.DialogOverlay
			{...props}
			className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
		/>
	)
}

export function DialogContent(props) {
	return (
		<DialogPortal>
			<DialogOverlay />

			<DialogPrimitive.DialogContent
				{...props}
				className="fixed z-50 right-0 top-0 bottom-0 w-[400px] h-screen border-l border-zinc-200 bg-zinc-300 p-8"
			/>
		</DialogPortal>
	)
}

export function DialogTitle(props) {
	return (
		<DialogPrimitive.DialogTitle {...props} className="text-lg font-semibold" />
	)
}

export function DialogDescription(
	props
) {
	return (
		<DialogPrimitive.DialogDescription
			{...props}
			className="text-zinc-400 text-sm leading-relaxed"
		/>
	)
}
