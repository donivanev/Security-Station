import { initializeApp } from "firebase/app"
import { getStorage, ref } from "firebase/storage"

const firebaseApp = initializeApp ({
    apiKey: 'AIzaSyBUTIdY3DTD48Xi1neY852mnB2LzKqduEQ',
    authDomain: 'esp32cam-photos.firebaseapp.com',
    projectId: 'esp32cam-photos',
    storageBucket: 'esp32cam-photos.appspot.com'
});

const storage = getStorage(firebaseApp)
export default storage