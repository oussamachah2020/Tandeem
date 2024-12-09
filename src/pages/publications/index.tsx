import {Main} from "@/common/components/global/Main";
import {SectionName} from "@/common/security/Sections";
import {GetServerSideProps, GetServerSidePropsResult, NextPage} from "next";
import {Modal} from "@/common/components/global/Modal";
import {AuthenticatedUser} from "@/common/services/AuthService";
import useModal from "@/common/hooks/UseModal";
import {getToken} from "next-auth/jwt";
import ActionBar from "@/common/components/global/ActionBar";
import useSearch from "@/common/hooks/UseSearch";
import EmptyContent from "@/common/components/atomic/EmptyContent";
import PublicationCard from "@/domain/publications/components/PublicationCard";
import PublicationCreateForm from "@/domain/publications/components/PublicationCreateForm";
import publicationService from "@/domain/publications/services/PublicationService";
import PublicationUpdateForm from "@/domain/publications/components/PublicationUpdateForm";
import useFilter from "@/common/hooks/UseFilter";
import FilterGroup from "@/common/components/filter/FilterGroup";
import Filter from "@/common/components/filter/Filter";
import {ArrayElement} from "@/common/utils/types";

interface Props {
    user: AuthenticatedUser
    publications: Awaited<ReturnType<typeof publicationService.getAll>>
}

const Publications: NextPage<Props> = ({user, publications}) => {
    const [, isPublicationCreateModalShown, togglePublicationCreateModal] = useModal(false)
    const [publicationToUpdate, isPublicationUpdateModalShown, togglePublicationUpdateModal] = useModal<ArrayElement<typeof publications>>()

    const [searchResultedPublications, onSearchInputChange] = useSearch<ArrayElement<typeof publications>>(publications, ['title'])
    const [filteredPublications, onFilterValueChange] = useFilter<ArrayElement<typeof publications>>(searchResultedPublications, ['pinned'])
    return (
        <>
            <Main section={SectionName.Publications} user={user}>
                <ActionBar action={{text: 'Ajouter une publication', onClick: () => togglePublicationCreateModal(true)}} onSearchInputChange={onSearchInputChange}/>
                <FilterGroup>
                    <Filter
                        icon='BookmarkIcon'
                        label='Épinglé'
                        values={[['true', 'Oui'], ['false', 'Non']]}
                        onValueChange={(event) => onFilterValueChange('pinned', event)}
                    />
                </FilterGroup>
                {filteredPublications.length > 0 ?
                    <div className='grid grid-cols-2 gap-4'>
                        {filteredPublications.map((publication, idx) =>
                            <PublicationCard
                                key={idx}
                                publication={publication}
                                onUpdate={() => togglePublicationUpdateModal(true, publication)}
                            />)}
                    </div>
                    : <EmptyContent/>}

            </Main>
            <Modal title='Ajouter une publication' isShown={isPublicationCreateModalShown} onClose={() => togglePublicationCreateModal(false)}>
                <PublicationCreateForm/>
            </Modal>
            <Modal title='Modifier la publication' isShown={isPublicationUpdateModalShown} onClose={() => togglePublicationUpdateModal(false)}>
                <PublicationUpdateForm publication={publicationToUpdate}/>
            </Modal>
        </>
    );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = (await getToken(context)) as unknown as AuthenticatedUser

    const publications = await publicationService.getAll(user.customer?.id);

    const result: GetServerSidePropsResult<Props> = {
        props: {
            user: JSON.parse(JSON.stringify(user)),
            publications: JSON.parse(JSON.stringify(publications))
        }
    }

    return result
}

export default Publications;
