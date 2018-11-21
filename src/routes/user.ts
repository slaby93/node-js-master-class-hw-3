import * as http from 'http'
import { RouteOutput, Endpoint } from './../interfaces'
import Method from './../consts/methods'
import User from './../models/User'
import randomStringGenerator from './../utils/randomStringGenerator'
import { checkToken } from '../utils/routes';
import hash from '../utils/hash';

const handler: Endpoint = {
    /** 
     * Get you user info
     * Accepts: id - user id
     * Retruns: user - object with user details
     */
    [Method.GET]: async (bodyData: any, queryParamsData: any, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput> => {
        res.setHeader('Content-Type', 'application/json')
        try {
            const { id } = queryParamsData
            if (!id) {
                return { responseStatus: 400, response: { err: 'Id is not provided' } }
            }
            const isValid = await checkToken(req, id)
            if (!isValid) {
                return { responseStatus: 401, response: { err: 'Not authorized' } }
            }
            const user = new User()
            user.id = id
            await user.load()
            return { responseStatus: 200, response: user }

        } catch {
            return { responseStatus: 500, response: { err: 'Error while getting user' } }
        }
    },
    /**
     * Creates new user
     * Accepts:
     *      name - user name
     *      email - valid user email
     *      address - user address
     *      password - user password
     */
    [Method.POST]: async (bodyData: any, queryParamsData: any, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput> => {
        res.setHeader('Content-Type', 'application/json')
        try {
            const {
                name,
                email,
                address,
                password
            } = bodyData
            const newUser = new User()
            const hashedPassword = hash(password)
            newUser.name = name
            newUser.email = email
            newUser.address = address
            newUser.password = hashedPassword
            newUser.id = randomStringGenerator(20)
            await newUser.save()

            return { responseStatus: 200, response: newUser }
        } catch {
            return { responseStatus: 500, response: { err: 'Error while creating user' } }
        }
    },
    /**
     * Edit user info
     * Accepts: 
     *      name - user name
     *      email - valid user email
     *      address - user address
     * Returns: updates user
     */
    [Method.PUT]: async (bodyData: any, queryParamsData: any, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput> => {
        try {
            const {
                id,
                name,
                email,
                address
            } = bodyData
            if (!id) {
                return { responseStatus: 400, response: { err: 'Invalid id field' } }
            }
            const isValid = await checkToken(req, id)
            if (!isValid) {
                return { responseStatus: 401, response: { err: 'Not authorized' } }
            }
            const user = new User()
            user.id = id
            await user.load()
            if (name) {
                user.name = name
            }
            if (address) {
                user.address = address
            }
            if (email) {
                user.email = email
            }
            await user.update()
            return { responseStatus: 200, response: { user } }
        } catch (error) {
            return { responseStatus: 500, response: { err: 'Error while updating user data' } }
        }
    },
    /**
     * Removes user
     * Accepts: id - user id
     * Returns: -none-
     */
    [Method.DELETE]: async (bodyData: any, queryParamsData: any, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput> => {
        try {
            const { id } = bodyData
            if (!id) {
                return { responseStatus: 400, response: { err: 'Invalid id field' } }
            }
            const isValid = await checkToken(req, id)
            if (!isValid) {
                return { responseStatus: 401, response: { err: 'Not authorized' } }
            }
            const user = new User()
            user.id = id
            await user.delete()
            return { responseStatus: 200 }

        } catch (error) {
            return { responseStatus: 500, response: { err: 'Error while deleting user' } }
        }

    },
}

export default handler