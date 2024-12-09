import {FC} from "react";
import ActionButton from "@/common/components/atomic/ActionButton";
import {ImagePreview} from "@/common/components/global/ImagePreview";
import {CheckIcon, XMarkIcon} from "@heroicons/react/20/solid";
import {formatDate} from "@/common/utils/functions";
import ConfirmableActionButton from "@/common/components/atomic/ConfirmableActionButton";
import {ArrayElement} from "@/common/utils/types";
import publicationService from "@/domain/publications/services/PublicationService";

interface Props {
    publication: ArrayElement<Awaited<ReturnType<typeof publicationService.getAll>>>
    onUpdate: () => void
}

const PublicationCard: FC<Props> = ({publication, onUpdate}) =>
    (
        <div className='grid grid-cols-5 gap-6 bg-white rounded-xl p-6 border box-border'>
            <div className='col-span-2 flex flex-col gap-5'>
                <ImagePreview imageRef={publication.photo} width='w-full' aspectRatio='aspect-video'
                              bgStyle='bg-cover'/>
                <div className='flex items-center justify-around text-sm'>
                    <div className='flex gap-3'>
                        Épinglé
                        {publication.pinned ? <CheckIcon className='w-5 h-5 text-primary'/> :
                            <XMarkIcon className='w-5 h-5 text-primary'/>}
                    </div>
                    <div className='h-full border-l'></div>
                    <div className='flex gap-3'>
                        Créé
                        <span className='font-medium text-primary'>
                            {formatDate(publication.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
            <div className='col-span-3 flex flex-col gap-4 justify-start'>
                <div className='w-full flex justify-between items-center'>
                    <div className='text-lg font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]'>
                        {publication.title}
                    </div>
                    <div>
                        <ActionButton icon='PencilSquareIcon' hoverColor='hover:bg-sky-200' onClick={onUpdate}/>
                        <ConfirmableActionButton
                            action='/api/publications/delete'
                            resourceId={publication.id}
                            template='DELETE'
                            message=''
                        />
                    </div>
                </div>
                <div className='text-sm whitespace-pre-line leading-loose'>
                    {publication.content}
                </div>
            </div>
        </div>
    )

export default PublicationCard