import * as Icons from "@heroicons/react/24/outline";
import {ArrowPathIcon} from "@heroicons/react/24/outline";
import {FC, SyntheticEvent} from "react";

interface Props {
    text: string
    icon: keyof typeof Icons
    color?: string
    textColor?: string
    fullWidth?: boolean
    onClick?: (e: SyntheticEvent) => void
    disabled?: boolean
    loading?: boolean
    className?: string
}

const Button: FC<Props> = ({text, icon, color, onClick, className, disabled, loading, fullWidth, textColor}) => {
    const Icon = Icons[icon]
    return (
        <button
            className={`${fullWidth && 'w-full'} flex justify-center items-center gap-3.5 rounded-lg px-5 py-3 hover:brightness-95 transition duration-200 disabled:bg-neutral-100 disabled:text-gray-500 disabled:hover:brightness-100 ${color ?? 'bg-secondary'} ${textColor ?? 'text-white'} ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading
                ? <ArrowPathIcon className='w-6 h-6 animate-spin'/>
                : <>
                    <Icon className='w-6 h-6'/>
                    {text}
                </>
            }
        </button>
    );
}

export default Button