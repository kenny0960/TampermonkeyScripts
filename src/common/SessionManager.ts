class SessionManager {
    static has(key: string): boolean {
        return sessionStorage.getItem(key) !== null;
    }

    static getByKey(key: string): string {
        if (SessionManager.has(key) === false) {
            return '';
        }
        return sessionStorage.getItem(key);
    }

    static setByKey(key: string, value: string): void {
        sessionStorage.setItem(key, value);
    }
}

export default SessionManager;
