import { useState, useRef, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Spinner from '../../app/components/Spinner';
import { ExclamationIcon } from '@heroicons/react/outline';

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
                        <div className="inline-block align-middle max-w-lg w-full my-8 bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
                            <div className="p-6">
                                <div className="flex items-start">
                                    {props.type === 'warning' &&
                                        <div className="flex flex-shrink-0 items-center justify-center h-10 w-10 mr-4 rounded-full bg-yellow-100 text-yellow-500">
                                            <ExclamationIcon className="w-6 h-6" />
                                        </div>
                                    }
                                    {props.type === 'error' &&
                                        <div className="flex flex-shrink-0 items-center justify-center h-10 w-10 mr-4 rounded-full bg-red-100 text-red-500">
                                            <ExclamationIcon className="w-6 h-6" />
                                        </div>
                                    }
                                    <div className="pt-1">
                                        <Dialog.Title className="mb-3">{props.title}</Dialog.Title>
                                        {props.children}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end bg-gray-50 p-4">
                                <button type="button" className="btn btn_secondary" onClick={() => handleClose()} ref={cancelButtonRef}>Закрыть</button>
                                {props.onAction && (
                                    <button type="button" className={`btn ml-3 ${props.type === 'warning' ? 'btn_danger' : 'btn_secondary'}`} disabled={props.actionProcess} onClick={props.onAction}>
                                        {props.actionProcess &&
                                            <div className="w-5 h-5 mr-2">
                                                <Spinner />
                                            </div>
                                        }
                                        Выполнить
                                    </button>
                                )}
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
