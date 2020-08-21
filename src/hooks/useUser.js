import { useState, useEffect } from 'react';
import { shallowEqual } from 'react-redux';

/**
 * @typedef user
 * @property {string|number} FacebookID
 * @property {string} FirstName
 * @property {string} LastName
 * @property {string} PersonID
 * @property {number} Type
 * @property {string} UserFullName
 * @property {number} UserID
 * @property {Object} ChaynsLogin
 * @property {number} ChaynsLogin.ChaynsUserID
 * @property {string|number} ChaynsLogin.FacebookUserID
 * @property {string} ChaynsLogin.FirstName
 * @property {number} ChaynsLogin.Flag
 * @property {boolean} ChaynsLogin.IsAdmin
 * @property {string} ChaynsLogin.LastName
 * @property {number} ChaynsLogin.LocationID
 * @property {string} ChaynsLogin.PersonID
 * @property {string} ChaynsLogin.TobitNetID
 * @property {number} ChaynsLogin.TobitUserID
 * @property {number} ChaynsLogin.UserID
 * @property {*} ChaynsLogin.aud
 * @property {string|Date} ChaynsLogin.exp
 * @property {string|Date} ChaynsLogin.iat
 * @property {string} ChaynsLogin.exp
 * @property {string} ChaynsLogin.sub
 */
/**
 * Wrapper for chayns.getUser to use inside a react component
 * @param {{userId:number}|{personId:string}|{accessToken:string}} userInfo
 * @return {{}|user|{Error:string}}
 */
const useUser = (userInfo) => {
    const [user, setUser] = useState({});
    const [prevUserInfo, setPrevUserInfo] = useState({});
    useEffect(() => {
        if (userInfo && !shallowEqual(prevUserInfo, userInfo)) {
            chayns.getUser(userInfo)
                .then((r) => {
                    setPrevUserInfo(userInfo);
                    setUser(r);
                });
        }
    }, [userInfo]);
    return user;
};

export default useUser;
