import { useState, useEffect } from 'react';
import shallowEqual from '../functions/shallowEqual';
import types from '../functions/types';


export interface UseUserConfig {
    userId?: number,
    personId?: string
}

export interface GetUserResult {
    Type: number,
    PersonID: string,
    FacebookID: number,
    FirstName: string,
    UserID: number,
    LastName: string,
    ChaynsLogin: string,
    UserFullName: string
}

const usersCache: Array<GetUserResult> = [];

/**
 * Wrapper for chayns.getUser to use inside a react component
 */
const useUser = (userInfo: UseUserConfig) => {
    const [user, setUser] = useState({});
    const [prevUserInfo, setPrevUserInfo] = useState({});
    useEffect(() => {
        if (userInfo && !shallowEqual(prevUserInfo, userInfo)) {
            if (!types.isNullOrEmpty(usersCache)) {
                const cacheUser = usersCache.find((u) => ((userInfo.userId && u.UserID === userInfo.userId)
                    || (userInfo.personId && u.PersonID === userInfo.personId)));
                if (cacheUser) {
                    setPrevUserInfo(userInfo);
                    setUser(cacheUser);
                }
            }
            chayns.getUser(userInfo)
                .then((r: any) => {
                    setPrevUserInfo(userInfo);
                    setUser(r);
                    usersCache.push(r);
                });
        }
    }, [userInfo]);
    return user;
};

export default useUser;
