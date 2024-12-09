import {FC, ReactNode} from "react";
import EmptyContent from "@/common/components/atomic/EmptyContent";

interface Props {
    isEmpty: boolean
    headers: string[]
    children?: ReactNode
}

const Datatable: FC<Props> = ({isEmpty, headers, children}) =>
    isEmpty
        ? <EmptyContent/>
        : <div className='bg-white rounded-lg border px-6 py-4'>
            <table className="w-full text-left">
                <thead>
                <tr>
                    {headers.map((header, idx) => <th key={idx}>{header}</th>)}
                </tr>
                </thead>
                <tbody>
                {children}
                </tbody>
            </table>
        </div>

export default Datatable