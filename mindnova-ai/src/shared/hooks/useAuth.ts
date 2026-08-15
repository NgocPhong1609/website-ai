import { useState, useEffect } from 'react';

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        try {
            const userInfoRaw = window.localStorage.getItem("userInfo");
            const accessToken = window.localStorage.getItem("accessToken");
            
            if (userInfoRaw) {
                setUser(JSON.parse(userInfoRaw));
            }
            if (accessToken) {
                setToken(accessToken);
            }
        } catch (e) {
            console.error("Error parsing user info", e);
        }
    }, []);

    return { user, token };
}
