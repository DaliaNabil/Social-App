import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { ServiceAccount } from 'firebase-admin/app';
import serviceAccount from '../../serviceAccount.json';

const serviceAccountKey = serviceAccount as unknown as ServiceAccount;

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccountKey)
    });
}

export default initializeApp;