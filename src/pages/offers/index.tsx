import {GetServerSideProps, GetServerSidePropsResult, NextPage} from "next";
import {AuthenticatedUser} from "@/common/services/AuthService";
import {Main} from "@/common/components/global/Main";
import {SectionName} from "@/common/security/Sections";
import {ChangeEvent} from "react";
import useSearch from "@/common/hooks/UseSearch";
import useFilter from "@/common/hooks/UseFilter";
import ActionBar from "@/common/components/global/ActionBar";
import FilterGroup from "@/common/components/filter/FilterGroup";
import Filter from "@/common/components/filter/Filter";
import OfferTable from "@/domain/offers/level-one/components/OfferTable";
import {Modal} from "@/common/components/global/Modal";
import {OfferCreateForm} from "@/domain/offers/level-one/components/OfferCreateForm";
import OfferDetails from "@/domain/offers/level-one/components/OfferDetails";
import useModal from "@/common/hooks/UseModal";
import {getToken} from "next-auth/jwt";
import offerService from "@/domain/offers/shared/services/OfferService";
import partnerService from "@/domain/partners/services/PartnerService";
import {labeledOfferStatuses} from "@/common/utils/statics";
import OfferUpdateForm from "@/domain/offers/level-one/components/OfferUpdateForm";
import {ArrayElement} from "@/common/utils/types";
import {getRoleLevel} from "@/common/utils/functions";

interface Props {
    user: AuthenticatedUser
    partners: Awaited<ReturnType<typeof partnerService.getAll>>
    offers: Awaited<ReturnType<typeof offerService.getAllForLevel1>>
}

const Offers: NextPage<Props> = ({user, offers, partners}) => {
    const [, isAddOfferModalShown, toggleAddOfferModal] = useModal(false)
    const [offerToShow, isOfferModalShown, toggleOfferModal] = useModal<ArrayElement<typeof offers>>()
    const [offerToUpdate, isOfferUpdateModalShown, toggleOfferUpdateModal] = useModal<ArrayElement<typeof offers>>()

    const [searchResultedOffers, onSearchInputChange] = useSearch(offers, ['title'])
    const [filteredOffers, onFilterValueChange] = useFilter(searchResultedOffers, ['partner.id' as any, 'status'])

    return (
        <>
            <Main section={SectionName.Offers} user={user}>
                <ActionBar action={{text: 'Ajouter une offre', onClick: () => toggleAddOfferModal(true)}}
                           onSearchInputChange={onSearchInputChange}/>
                <FilterGroup>
                    <Filter
                        label='Partenaire'
                        icon='BriefcaseIcon'
                        values={partners.map(({id, name}) => [id, name])}
                        onValueChange={(e: ChangeEvent<HTMLSelectElement>) => onFilterValueChange('partner.id' as any, e)}
                    />
                    <Filter
                        label='Status'
                        icon='ArrowPathIcon'
                        values={labeledOfferStatuses}
                        onValueChange={(e: ChangeEvent<HTMLSelectElement>) => onFilterValueChange('status', e)}
                    />
                </FilterGroup>
                <OfferTable
                    offers={filteredOffers}
                    onClick={(offer: any) => toggleOfferModal(true, offer)}
                    onUpdate={(offer: any) => toggleOfferUpdateModal(true, offer)}
                />
            </Main>
            <Modal title='Ajouter une offre' isShown={isAddOfferModalShown} onClose={() => toggleAddOfferModal(false)}
                   width='w-3/5'>
                <OfferCreateForm partners={partners}/>
            </Modal>
            <Modal title="Détails de l'offre" isShown={isOfferModalShown} onClose={() => toggleOfferModal(false)}>
                <OfferDetails offer={offerToShow}/>
            </Modal>
            <Modal title="Modifier l'offre" isShown={isOfferUpdateModalShown}
                   onClose={() => toggleOfferUpdateModal(false)} width='w-3/5'>
                <OfferUpdateForm offer={offerToUpdate}/>
            </Modal>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = (await getToken(context)) as unknown as AuthenticatedUser;

    if (getRoleLevel(user.role) === 2)
        return ({
            redirect: {
                destination: 'offers/customer',
                permanent: true
            }
        })

    const offers = await offerService.getAllForLevel1()
    const partners = await partnerService.getAll()
    const result: GetServerSidePropsResult<Props> = {
        props: {
            user: JSON.parse(JSON.stringify(user)),
            offers: JSON.parse(JSON.stringify(offers)),
            partners: JSON.parse(JSON.stringify(partners))
        }
    }

    return result
}

export default Offers;
