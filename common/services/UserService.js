import { AService } from "./AService";

export class UserService extends AService {
    get fb() {
        return this.api.firebase;
    }
    init() {
        this.fb.listenUser((user) => {
            if (user) {
                // User is signed in.
                // var isAnonymous = user.isAnonymous
                // var uid = user.uid
                // var userRef = app.dataInfo.child(app.users);
                // var useridRef = userRef.child(app.userid);
                // useridRef.set({
                //   locations: "",
                //   theme: "",
                //   colorScheme: "",
                //   food: ""
                // });
            } else {
                this.fb.signInAnonymously();
                // User is signed out.
                // ...
            }
            // ...
            this.api.notify(this.ref);
        });
    }
    getInfo() {
        const user = this.fb.getCurrentUser();
        if (user !== null) {
            user.providerData.forEach(function (profile) {
                // console.log('Sign-in provider: ' + profile.providerId)
                // console.log('  Provider-specific UID: ' + profile.uid)
                // console.log('  Name: ' + profile.displayName)
                // console.log('  Email: ' + profile.email)
                // console.log('  Photo URL: ' + profile.photoURL)
            });
        }
        return user || {};
    }
    onLogin() {
        this.fb.linkProvider();
    }
    onLogout() {
        this.fb.logout();
    }
}