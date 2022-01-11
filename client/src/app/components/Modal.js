import { useState, useRef, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Modal(props) {
    let [isOpen, setIsOpen] = useState(false);

    const cancelButtonRef = useRef(null)

    useEffect(() => {
        setIsOpen(props.isOpen);
    }, [props.isOpen])

    function handleClose() {
        setIsOpen(false);
        props.onClose();
    }

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={handleClose}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <header className="bg-gray-50 px-4 py-3 text-center">
                                <Dialog.Title className="mb-1">{props.title}</Dialog.Title>
                                <Dialog.Description className="font-bold text-gray-400">{props.description}</Dialog.Description>
                            </header>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                {props.children}
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="button" className="btn btn_secondary" onClick={() => handleClose()} ref={cancelButtonRef}>Закрыть</button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
