import {FC, ReactNode, useMemo, useState} from "react";
import {TitleBar} from "@/common/components/global/TitleBar";
import {SectionName, SECTIONS as Sections} from "@/common/security/Sections";
import * as Icons from "@heroicons/react/24/outline";
import {AuthenticatedUser} from "@/common/services/AuthService";
import Link from "@/common/components/atomic/Link";

interface Props {
    user: AuthenticatedUser
    section: SectionName
    children?: ReactNode
}

export const Main: FC<Props> = ({user, section, children}) => {
    const sections = useMemo(() => {
        return Sections.filter(({authorizedRoles}) => {
            return authorizedRoles.includes(user.role);
        });
    }, [user.role])
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

    return (
        <>
            <aside className='fixed top-0 left-0 z-40 h-screen w-24 hover:w-80 transition-all duration-200'>
                <div
                    className="h-full flex flex-col gap-16 px-3 py-12 overflow-y-auto bg-white border-r"
                    onMouseEnter={() => setSidebarCollapsed(false)}
                    onMouseLeave={() => setSidebarCollapsed(true)}
                >
                    <img
                        className='mx-auto h-14'
                        src={`/img/${sidebarCollapsed ? 'logo-blue-1' : 'logo-blue'}.svg`}
                        alt="Logo Tandeem"
                    />
                    <ul className="space-y-3 text-gray-400">
                        {sections
                            .filter(section => section.showInSidebar)
                            .map(({name, icon, href}, idx) => {
                                const Icon = Icons[icon]
                                return (
                                    <li key={idx}>
                                        <Link
                                            className={`grid gap-5 px-4 py-3 rounded-lg transition duration-150 ${section === name ? "text-secondary" : 'hover:text-black hover:bg-neutral-50'}`}
                                            style={{gridTemplateColumns: 'auto minmax(0, 1fr)'}}
                                            styled={false}
                                            internal={true}
                                            href={href}
                                        >
                                            <Icon className='w-7 h-7'/>
                                            <div
                                                className={`whitespace-nowrap text-ellipsis overflow-hidden ${sidebarCollapsed ? 'hidden' : 'block'}`}
                                            >
                                                {name}
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })}
                    </ul>
                </div>
            </aside>
            <main className='ml-24 flex flex-col gap-10 py-14 px-24'>
                <TitleBar title={section} userImageSrc={user.image ?? undefined}/>
                <div className='py-5'>
                    {children}
                </div>
            </main>
        </>
    )
}