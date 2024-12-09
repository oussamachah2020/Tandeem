import {NextApiRequest, NextApiResponse} from "next";
import {handle} from "@/apiMiddleware";
import employeeService from "@/domain/employees/services/EmployeeService";
import {EmployeeUpdateDto, EmployeeUpdateFilesDto} from "@/domain/employees/dtos/EmployeeUpdateDto";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<EmployeeUpdateDto, EmployeeUpdateFilesDto>(req, res, async (payload, useUser) => {
        const user = await useUser()
        const {body: employeeDto, files: {photo}} = payload
        return await employeeService.updateOne({...employeeDto, customerId: user.customer!.id, photo})
    }, ['photo'])

export const config = {
    api: {
        bodyParser: false,
    }
};
