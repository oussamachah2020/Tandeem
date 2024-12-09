import {NextApiRequest, NextApiResponse} from "next";
import {AuthenticatedUser} from "@/common/services/AuthService";
import {getToken} from "next-auth/jwt";
import {getMulterFields, toBlob} from "@/common/utils/functions";
import Multer from "multer";

interface Payload<TBody, TFiles> {
body: TBody,
files: TFiles
}

type Action<TBody, TFiles> = (payload: Payload<TBody, TFiles>, useUser: () => Promise<AuthenticatedUser>) => (Promise<any> | any)

export const handle = async <TBody, TFiles = {}>(
req: NextApiRequest,
res: NextApiResponse,
action: Action<TBody, TFiles>,
multerFiles?: (keyof TFiles)[] | null,
    options?: { redirectTo: string }
) => {
    const useUser = async () => (await getToken({req})) as unknown as AuthenticatedUser
    const handleAction = async (files?: TFiles) => {
        let queryParams: URLSearchParams;
        try {
            const result = await action({body: req.body, files: files ?? {} as TFiles}, useUser)
            queryParams = new URLSearchParams(result ? {_notif: result} : undefined)
        } catch (e) {
            console.error(e)
            queryParams = new URLSearchParams({_notif: 'unexpectedError'})
        }
        // Fixed: Added backticks for template string
        res.redirect(`${options?.redirectTo ?? req.headers.referer!.split('?')[0]}?${queryParams}`);
    }

    if (multerFiles)
        Multer()
            .fields(getMulterFields(multerFiles as string[]))
            (req as any, res as any, async () => {
                const files = Object
                    .entries((req as any).files as Record<string, Express.Multer.File[]>)
                    .reduce((acc, [key, values]) => {
                        // @ts-ignore
                        acc[key] = toBlob(values[0])
                        return acc
                    }, {} as TFiles)
                await handleAction(files)
            })
    else await handleAction()
}