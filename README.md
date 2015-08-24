# Test app using Ionic and Firebase

[http://zijpn.github.io/test-app-ionic/](http://zijpn.github.io/test-app-ionic/)

Resources to get started:
- [Ionic Documentation](http://ionicframework.com/docs/)
- [AngularFire Documentation](https://www.firebase.com/docs/web/libraries/angular/)
- [Firebase Web Quickstart](https://www.firebase.com/docs/web/quickstart.html)

Prepare for android:
- ionic platform add android
- ionic plugin add cordova-plugin-inappbrowser
- ionic plugin add com.triarc.cookies

Run on android (device or emulator):
- ionic build android
- ionic run android

Rebuild dist folter and update gh-pages:
- gulp
- git add .
- git commit -m "..."
- git push origin master
- git subtree push --prefix dist origin gh-pages

Scores:
- [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
  - mobile: 59% (speed), 100% (UX)
  - desktop: 78%
- [GTmetrix](https://gtmetrix.com/)
  - PageSpeed: 92%
  - YSlow: 95%
