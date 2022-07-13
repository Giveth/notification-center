import {NextFunction, Request, Response} from 'express';
import {decodeBasicAuthentication} from '../utils/authorizationUtils';
import {StandardError} from '../types/StandardError';
import {errorMessagesEnum} from '../utils/errorMessages';
import {MICRO_SERVICES} from "../utils/utils";

const givethIoUsername = process.env.GIVETHIO_USERNAME
const givethIoPassword = process.env.GIVETHIO_PASSWORD

const traceUsername = process.env.TRACE_USERNAME
const tracePassword = process.env.TRACE_PASSWORD


export const authenticateThirdPartyBasicAuth = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authorization = req.headers.authorization as string;
        if (!authorization) {
            throw new StandardError(errorMessagesEnum.UNAUTHORIZED);
        }
        const {username, secret} = decodeBasicAuthentication(authorization);
        let microService;
        if (username === givethIoUsername && secret === givethIoPassword) {
            microService = MICRO_SERVICES.givethio
        } else if (username === traceUsername && secret === tracePassword) {
            microService = MICRO_SERVICES.trace
        } else {
            throw new StandardError(errorMessagesEnum.UNAUTHORIZED);
        }

        res.locals.microService = microService;
        next();
    } catch (e) {
        console.log('authenticateThirdPartyBasicAuth error', e);
        next(e);
    }
};
