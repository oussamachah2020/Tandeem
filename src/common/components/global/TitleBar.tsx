import {FC, useState} from "react";
import {ChevronDownIcon} from "@heroicons/react/24/outline";
import {signOut} from "next-auth/react";
import {getDownloadUrl} from "@/common/utils/functions";
import {Dropdown} from "@/common/components/global/Dropdown";
import {DropdownItem} from "@/common/components/global/DropdownItem";
import Link from "@/common/components/atomic/Link";
import {useStaticValues} from "@/common/context/StaticValuesContext";
import {SectionName} from "@/common/security/Sections";

interface Props {
    title: string
    userImageSrc?: string
}

export const TitleBar: FC<Props> = ({title, userImageSrc}) => {
    const {action} = useStaticValues()
    const [isDropdownShown, setIsDropdownShown] = useState(false)

    return (
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-medium">{title}</h1>
            <div
                onClick={() => setIsDropdownShown(isShown => !isShown)}
                className="relative flex gap-2 justify-end items-center cursor-pointer"
            >
                <img
                    src={userImageSrc ? getDownloadUrl(userImageSrc) : '/img/logo-blue-1.svg'}
                    alt="User avatar"
                    className={userImageSrc
                        ? 'w-14 h-14 aspect-square object-cover rounded-xl'
                        : 'w-12 h-12 object-contain rounded-lg'}
                />
                <ChevronDownIcon className='w-5 h-5 text-gray-500 hover:text-black transition duration-200'/>
                <Dropdown isShown={isDropdownShown} close={() => setIsDropdownShown(false)}>
                    <DropdownItem icon='UserIcon'>
                        <Link
                            href="/profile"
                            internal={true}
                            styled={false}
                            className="py-2 px-3"
                        >
                            {SectionName.Profile}
                        </Link>
                    </DropdownItem>
                    <DropdownItem icon='ArrowRightOnRectangleIcon'>
                        <Link
                            href="#"
                            internal={true}
                            styled={false}
                            className="py-2 px-3"
                            onClick={async () => await signOut({callbackUrl: '/login'})}
                        >
                            {action.signOut}
                        </Link>
                    </DropdownItem>
                </Dropdown>
            </div>
        </div>
    )
}