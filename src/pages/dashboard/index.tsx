import {Main} from "@/common/components/global/Main";
import {SectionName} from "@/common/security/Sections";
import {GetServerSideProps, GetServerSidePropsResult, NextPage} from "next";
import {AuthenticatedUser} from "@/common/services/AuthService";
import {getToken} from "next-auth/jwt";
import {
    BriefcaseIcon,
    BuildingOfficeIcon,
    NewspaperIcon,
    ReceiptPercentIcon,
    RectangleStackIcon,
    UsersIcon
} from "@heroicons/react/24/outline";
import React from "react";
import prisma from "@/common/libs/prisma";
import {Role} from "@prisma/client";
import {getRoleLevel} from "@/common/utils/functions";

interface Props {
    user: AuthenticatedUser;
    kpis: {
        admins: number;
        customers: number,
        partners: number,
        offers: number,
        publications: number;
        medias: number,
        employees: number
        acceptedOffers: number
        awaitingOffers: number;
        ideaBox: number
    }
}

const Dashboard: NextPage<Props> = ({user, kpis}) => (
    <Main section={SectionName.Dashboard} user={user}>
        <div className='flex flex-col gap-4'>
            <div className="grid grid-cols-3 gap-4">
                {kpis.admins > -1 && <div
                    className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg text-gray-700 mb-0">{SectionName.Admins}</h3>
                        <UsersIcon className="w-7 h-7"/>
                    </div>
                    <p className="text-3xl font-medium">{kpis.admins}</p>
                </div>}
                {kpis.customers > -1 && <div
                    className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg text-gray-700 mb-0">{SectionName.Customers}</h3>
                        <BuildingOfficeIcon className="w-7 h-7"/>
                    </div>
                    <p className="text-3xl font-medium">{kpis.customers}</p>
                </div>}
                {kpis.partners > -1 && <div
                    className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg text-gray-700 mb-0">{SectionName.Partners}</h3>
                        <BriefcaseIcon className="w-7 h-7"/>
                    </div>
                    <p className="text-3xl font-medium">{kpis.partners}</p>
                </div>}
                {kpis.employees > -1 && <div
                    className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg text-gray-700 mb-0">{SectionName.Employees}</h3>
                        <BriefcaseIcon className="w-7 h-7"/>
                    </div>
                    <p className="text-3xl font-medium">{kpis.employees}</p>
                </div>}
                {kpis.offers > -1 && <div
                    className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg text-gray-700 mb-0">{getRoleLevel(user.role) === 1 ? SectionName.Offers : 'Mes offres exclusives'}</h3>
                        <ReceiptPercentIcon className="w-7 h-7"/>
                    </div>
                    <p className="text-3xl font-medium">{kpis.offers}</p>
                </div>}
                {kpis.acceptedOffers > -1 && <div
                    className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg text-gray-700 mb-0">Offres acceptées</h3>
                        <ReceiptPercentIcon className="w-7 h-7"/>
                    </div>
                    <p className="text-3xl font-medium">{kpis.acceptedOffers}</p>
                </div>}
                {kpis.awaitingOffers > -1 && <div
                    className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg text-gray-700 mb-0">Offres en attente</h3>
                        <ReceiptPercentIcon className="w-7 h-7"/>
                    </div>
                    <p className="text-3xl font-medium">{kpis.awaitingOffers}</p>
                </div>}
                {kpis.publications > -1 && <div
                    className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg text-gray-700 mb-0">{SectionName.Publications}</h3>
                        <NewspaperIcon className="w-7 h-7"/>
                    </div>
                    <p className="text-3xl font-medium">{kpis.publications}</p>
                </div>}
                {kpis.medias > -1 && <div
                    className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg text-gray-700 mb-0">{SectionName.MediaLibrary}</h3>
                        <RectangleStackIcon className="w-7 h-7"/>
                    </div>
                    <p className="text-3xl font-medium">{kpis.medias}</p>
                </div>}
                {kpis.ideaBox > -1 && <div
                    className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg text-gray-700 mb-0">{SectionName.IdeaBox}</h3>
                        <RectangleStackIcon className="w-7 h-7"/>
                    </div>
                    <p className="text-3xl font-medium">{kpis.ideaBox}</p>
                </div>}
            </div>
        </div>
    </Main>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = (await getToken(context)) as unknown as AuthenticatedUser;

    const kpis = {
        admins: -1,
        customers: -1,
        partners: -1,
        offers: -1,
        publications: -1,
        medias: -1,
        employees: -1,
        acceptedOffers: -1,
        awaitingOffers: -1,
        ideaBox: -1
    }
    if (user.role === Role.TANDEEM) {
        kpis.admins = await prisma.admin.count({where: {user: {customer: {is: null}}}})
    }
    if (user.role === Role.CUSTOMER) {
        kpis.admins = await prisma.admin.count({where: {user: {customerId: user.customer?.id}}})
    }
    if (getRoleLevel(user.role) === 1) {
        kpis.customers = await prisma.customer.count()
        kpis.partners = await prisma.partner.count()
        kpis.offers = await prisma.offer.count({where: {customer: {is: null}}})
        kpis.publications = await prisma.publication.count({where: {customer: {is: null}}})
        kpis.medias = await prisma.mediaLibrary.count({where: {customer: {is: null}}})
    }
    if (getRoleLevel(user.role) === 2) {
        kpis.employees = await prisma.employee.count({where: {customerId: user.customer?.id}})
        kpis.offers = await prisma.offer.count({where: {customerId: user.customer?.id}})
        kpis.acceptedOffers = await prisma.offer.count({where: {acceptedBy: {some: {customerId: user.customer?.id}}}})
        kpis.awaitingOffers = await prisma.offer.count({where: {customer: {is: null}, acceptedBy: {every: {customerId: {not: user.customer?.id}}}}})
        kpis.publications = await prisma.publication.count({where: {customerId: user.customer?.id}})
        kpis.medias = await prisma.mediaLibrary.count({where: {customerId: user.customer?.id}})
        kpis.ideaBox = await prisma.ideaBox.count({where: {employee: {customerId: user.customer?.id}}})
    }
    const result: GetServerSidePropsResult<Props> = {
        props: {
            user: JSON.parse(JSON.stringify(user)),
            kpis
        },
    };

    return result;
};

export default Dashboard;